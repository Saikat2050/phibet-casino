import { sequelize } from '@src/database/models'
import { serverDayjs } from '@src/libs/dayjs'
import _ from 'lodash'
import { Op } from 'sequelize'
import { OK, UPLOAD_FILE_SIZE } from '@src/utils/constants/public.constants.utils'
import CryptoJS from 'crypto-js'

/**
 * @param {string} startDate
 * @param {string} endDate
 * @returns
 */
export function alignDatabaseDateFilter (startDate, endDate) {
  let filterObj = {}
  if (startDate && endDate) filterObj = { [Op.and]: [{ [Op.gte]: serverDayjs(startDate).format() }, { [Op.lte]: serverDayjs(endDate).format() }] }
  else if (endDate) filterObj = { [Op.lte]: serverDayjs(endDate).format() }
  else if (startDate) filterObj = { [Op.gte]: serverDayjs(startDate).format() }

  return filterObj
}

/**
 * @param {Object.<string, string>} names
 */
export async function getLanguageWiseNameJson (newObject, oldObject) {
  _.mapKeys(newObject, (key) => key.toUpperCase())
  _.mapKeys(oldObject, (key) => key.toUpperCase())
  newObject = _.merge(oldObject, newObject)

  const languages = await sequelize.models.language.findAll({ raw: true })
  return languages.reduce((prev, language) => {
    prev[language.code] = newObject[language.code] || newObject.EN || ''
    return prev
  }, {})
}

/**
 * @param {Object.<string, Array>} childPermissions
 * @param {Object.<string, Array>} parentPermissions
 * @returns {Object.<string, Array>}
 */
export function pickChildPermissiosFromParentPermissions (childPermissions, parentPermissions) {
  return _.transform(_.pick(childPermissions, Object.keys(parentPermissions)), (result, value, key) => {
    const intersection = _.intersection(value, parentPermissions[key])
    if (intersection.length) result[key] = intersection
  })
}

/**
 * @param {string} key
 * @param {string?} previousExpireAt
 * @returns
 */
export function getExpireAt (key, previousExpireAt = null) {
  const timeUnit = key.includes('daily') ? 'd' : key.includes('weekly') ? 'w' : key.includes('monthly') ? 'M' : null
  if (!timeUnit) throw Error('Invalid time unit')
  if (!previousExpireAt) return serverDayjs().add(1, timeUnit).format()
  return serverDayjs().add(serverDayjs().diff(previousExpireAt, timeUnit) + 1, timeUnit).format()
}

/**
 * @param {string} parentAdminId
 * @param {string} childAdminId
 * @param {import('sequelize').Transaction} transaction
 * @returns
 */
export async function checkChild (parentAdminId, childAdminId, transaction) {
  if (!childAdminId || (parentAdminId === childAdminId)) return false
  const child = await sequelize.models.adminUser.findOne({ attributes: ['id', 'parentAdminId'], where: { id: childAdminId }, transaction })
  if (!child) return false
  return (child.parentAdminId === parentAdminId) ? child : await checkChild(parentAdminId, child.parentAdminId)
}

/**
 * @param {string} fileName
 */
export function migrationsTimestamp (fileName) {
  const parts = _.split(fileName, '-')
  const timestamp = _.parseInt(parts[0], 10)
  return _.isFinite(timestamp) ? timestamp : 0
}

export const validateFile = (res, file) => {
  if (file && file.size > UPLOAD_FILE_SIZE) return 'File size too large'

  if (file && file.mimetype) {
    const fileType = file.mimetype.split('/')[1]
    const supportedFileType = ['png', 'jpg', 'jpeg', 'tiff', 'svg+xml', 'webp', 'svg']
    if (!supportedFileType.includes(fileType)) return 'File type not supported'
  }

  return OK
}

export const pageValidationForScalio = (pageNo, limit) => {
  const pageAsNumber = Number.parseInt(pageNo)
  const sizeAsNumber = Number.parseInt(limit)
  let page = 1
  let size = 15

  size = sizeAsNumber
  page = pageAsNumber

  return { page, size }
}

export const isDateValid = date => {
  date = new Date(date)
  return date instanceof Date && !isNaN(date)
}
export const pageValidation = (pageNo, limit, maxSize = 200) => {
  const pageAsNumber = Number.parseInt(pageNo)
  const sizeAsNumber = Number.parseInt(limit)
  let page = 1
  let size = 15

  if (
    Number.isNaN(pageAsNumber) ||
    pageAsNumber < 0 ||
    Number.isNaN(sizeAsNumber) ||
    sizeAsNumber < 0 ||
    sizeAsNumber > maxSize
  ) {
    return { page, size }
  }

  size = sizeAsNumber
  page = pageAsNumber

  return { page, size }
}



export const decryptCardNumber = (encryptedCardNumber) => {
  try {
    const secretKey = process.env.CARD_ENCRYPTION_KEY || 'default-secret-key-change-in-production'
    const bytes = CryptoJS.AES.decrypt(encryptedCardNumber, secretKey)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    return '0000000000000000'
  }
}

export const maskCardNumber = (cardNumber) => {
  if (!cardNumber || cardNumber.length < 4) return '****'
  const firstTwo = cardNumber.substring(0, 2)
  const lastTwo = cardNumber.substring(cardNumber.length - 2)
  const maskedMiddle = '*'.repeat(Math.max(cardNumber.length - 4, 4))
  return firstTwo + maskedMiddle + lastTwo
}