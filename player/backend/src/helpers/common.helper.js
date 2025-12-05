import { config } from '@src/configs/config'
import { dayjs } from '@src/libs/dayjs'
import { Logger } from '@src/libs/logger'
import { Op } from 'sequelize'
import axios from 'axios'
import crypto from 'crypto'
import { encode as encrypt } from 'hi-base32'
import { DOCUMENT_STATUS, KYC_STATUS } from '@src/utils/constants/public.constants.utils'
import CryptoJS from 'crypto-js'

export function alignDatabaseDateFilter (startDate, endDate) {
  let filterObj = {}
  if (startDate && endDate) filterObj = { [Op.and]: [{ [Op.gte]: dayjs(startDate).format() }, { [Op.lte]: dayjs(endDate).endOf('day').format() }] }
  else if (endDate) filterObj = { [Op.gte]: dayjs(endDate).endOf('day').format() }
  else if (startDate) filterObj = { [Op.gte]: dayjs(startDate).format() }

  return filterObj
}

/**
 * @param {string} key
 * @param {string?} previousExpireAt
 * @returns
 */
export function getExpireAt (key, previousExpireAt = dayjs().format()) {
  const timeUnit = key.includes('daily') ? 'd' : key.includes('weekly') ? 'w' : key.includes('monthly') ? 'M' : null
  if (!timeUnit) throw Error('Invalid time unit')
  return dayjs().add(dayjs().diff(previousExpireAt, timeUnit) + 1, timeUnit).format()
}

export const generateSpinWheelIndex = async (objects) => {
  try {
    const allowedObjects = objects.filter(obj => obj.isAllow)

    if (allowedObjects.length === 0) {
      // If no allowed objects, return null or handle it according to your needs
      return { object: null, index: -1 }
    }

    // Sort allowed objects based on priorities in descending order
    allowedObjects.sort((a, b) => b.priority - a.priority)

    // Calculate total priority
    const totalPriority = allowedObjects.reduce((sum, obj) => sum + obj.priority, 0)

    // Generate a random number between 0 and totalPriority
    const randomNum = Math.random() * totalPriority

    // Iterate through the allowed objects to find the selected object
    let cumulativePriority = 0
    for (let i = 0; i < allowedObjects.length; i++) {
      const obj = allowedObjects[i]
      cumulativePriority += obj.priority
      if (randomNum < cumulativePriority) {
        return { object: obj, index: objects.indexOf(obj) } // Return the object and its index
      }
    }

    // Fallback: In case of unexpected scenario, return a random object and its index
    const randomObject = allowedObjects[Math.floor(Math.random() * allowedObjects.length)]
    return { object: randomObject, index: objects.indexOf(randomObject) }
  } catch (error) {
    Logger.info(`Error in Generating Spin Wheel Index - ${JSON.stringify(error)}`)
    return false
  }
}

export async function trackScaleoEvent (payload) {
  const scaleoURL = config.get('scaleo.base_url')
  const apiKey = config.get('scaleo.api_key')
  if (!scaleoURL || !apiKey) return false
  const url = `${scaleoURL}/api/v2/network/tracking/event?api-key=${apiKey}`
  const data = { ...payload }

  try {
    const response = await axios.post(url, data)
    Logger.info(`Scaleo response Data - ${JSON.stringify(response.data)}`)

    return true
  } catch (error) {
    Logger.error(`Error in Scaleo event - ${error}`)
    return false
  }
}

export const generateHashPassword = (password) => {
  if (!password) return false
  const secretKey = config.get('jwt.passwordHashKey')
  return crypto.createHmac('sha256', secretKey).update(password).digest('hex')
}

export const generateRandomBase32 = () => {
  const buffer = crypto.randomBytes(15)
  const base32 = encrypt(buffer).replace(/=/g, '').substring(0, 24)
  return base32
}


export async function calculateProgress (documents, requiredDocuments, kycLevel) {
  const totalRequired = requiredDocuments.length
  console.log("requireddocuments",requiredDocuments)
  const completedDocuments = documents.filter(doc => doc.status === DOCUMENT_STATUS.APPROVED).length
  const pendingDocuments = documents.filter(doc => doc.status === DOCUMENT_STATUS.PENDING).length
  const rejectedDocuments = documents.filter(doc => doc.status === DOCUMENT_STATUS.REJECTED).length
  const reRequestedDocuments = documents.filter(doc => doc.status === DOCUMENT_STATUS.RE_REQUESTED).length
  const inProgressDocuments = documents.filter(doc => doc.status === KYC_STATUS.IN_PROGRESS).length
  const progressPercentage = totalRequired > 0 ? Math.round((completedDocuments / totalRequired) * 100) : 0
  return {
    totalRequired,
    completedDocuments,
    pendingDocuments,
    rejectedDocuments,
    reRequestedDocuments,
    inProgressDocuments,
    progressPercentage,
    kycLevel
  }
}



/**
 * Encrypts a card number using AES encryption
 * @param {string} cardNumber - The plain text card number
 * @returns {string} - The encrypted card number
 */
export const encryptCardNumber = (cardNumber) => {
  try {
    const secretKey = process.env.CARD_ENCRYPTION_KEY || 'default-secret-key-change-in-production'
    return CryptoJS.AES.encrypt(cardNumber, secretKey).toString()
  } catch (error) {
    throw new Error('Failed to encrypt card number')
  }
}

/**
 * Decrypts an encrypted card number
 * @param {string} encryptedCardNumber - The encrypted card number
 * @returns {string} - The decrypted plain text card number
 */
export const decryptCardNumber = (encryptedCardNumber) => {
  try {
    const secretKey = process.env.CARD_ENCRYPTION_KEY || 'default-secret-key-change-in-production'
    const bytes = CryptoJS.AES.decrypt(encryptedCardNumber, secretKey)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    return '0000000000000000'
  }
}

/**
 * Masks a card number showing only first 2 and last 2 digits
 * @param {string} cardNumber - The plain text card number
 * @returns {string} - The masked card number (e.g., "12****34")
 */
export const maskCardNumber = (cardNumber) => {
  if (!cardNumber || cardNumber.length < 4) return '****'
  const firstTwo = cardNumber.substring(0, 2)
  const lastTwo = cardNumber.substring(cardNumber.length - 2)
  const maskedMiddle = '*'.repeat(Math.max(cardNumber.length - 4, 4))
  return firstTwo + maskedMiddle + lastTwo
}
