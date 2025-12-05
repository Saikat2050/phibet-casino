import bcrypt from 'bcrypt'
import CryptoJS from 'crypto-js'
import crypto from 'crypto'
import { encode as encrypt } from 'hi-base32'
import { Buffer } from 'buffer'
import { getOne, getAll, createNewEntity } from '../utils/crud'
import db, { sequelize, Sequelize } from '../db/models'
import { isNull } from 'lodash'
import jwt from 'jsonwebtoken'
import { plus, round } from 'number-precision'
import zlib from 'zlib'
import {
  UPLOAD_FILE_SIZE,
  OK,
  REGEX,
  USER_ACTIVITIES_TYPE,
  ROLE,
  RESPONSIBLE_GAMBLING_STATUS,
  BONUS_TYPE,
  RESPONSIBLE_GAMBLING_TYPE,
  BONUS_STATUS,
  TRANSACTION_TYPE,
  TRANSACTION_STATUS
} from '../utils/constants/constant'
import axios from 'axios'
import config from '../configs/app.config'
import is from 'request-ip/lib/is'
import { getClientIpFromXForwardedFor } from 'request-ip/lib'
import { Op } from 'sequelize'
import moment from 'moment'
import socketServer from '../libs/socketServer'
import { InternalServerErrorType } from './constants/errors'
import { fingerprintClient } from '../helpers/fingerprintClient'
import { allowedStates } from '../configs/states'

const s3Config = config.getProperties().s3

export const encryptPassword = password => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(
    Buffer.from(password, 'base64').toString('ascii'),
    salt
  )
}

export const validatePassword = password => {
  return !!Buffer.from(password, 'base64')
    .toString('utf-8')
    .match(REGEX.PASSWORD)
}

export const getDetails = async ({ currency, country }) => {
  let currencyId, countryName

  if (currency) {
    const details = await getOne({
      model: db.Currency,
      data: { code: currency },
      attributes: ['currencyId']
    })
    currencyId = details.currencyId
  }

  if (country) {
    const details = await getOne({
      model: db.Country,
      data: { code: country },
      attributes: ['name']
    })
    countryName = details.name
  }

  return { currencyId, countryName }
}

export const comparePassword = async (password, userPassword) => {
  if (!password) return false

  const result = await bcrypt.compare(
    Buffer.from(password, 'base64').toString('ascii'),
    userPassword
  )

  return result
}

export const signAccessToken = async ({
  name,
  email,
  id,
  uuid,
  sessionTime
}) => {
  const payload = { email, id, name, uuid }
  let expiresIn

  if (sessionTime) {
    expiresIn = `${sessionTime}h`
  } else {
    expiresIn = config.get('jwt.loginTokenExpiry')
  }

  const jwtToken = jwt.sign(payload, config.get('jwt.loginTokenSecret'), {
    expiresIn
  })

  return jwtToken
}

export const updateUser = async (detail, req, transaction) => {
  await db.User.update(
    {
      signInCount: +detail.signInCount + 1,
      signInIp: getClientIp(req),
      lastLoginDate: new Date()
    },
    {
      where: { userId: detail.userId },
      transaction
    }
  )
}

export const liveLoginUser = async msg => {
  if (!msg?.userId) return
  if (!msg?.deviceType) msg.deviceType = 'desktop'

  const user = await getOne({
    model: db.User,
    data: { userId: msg.userId },
    attributes: ['userId', 'loggedIn', 'deviceType']
  })

  await user
    .set({ loggedIn: user.loggedIn + 1, deviceType: msg.deviceType })
    .save()
}

export const loginUser = async (userData, transaction) => {
  if (!userData?.userId) return
  if (!userData?.deviceType) userData.deviceType = 'desktop'

  const user = await db.User.findOne({
    where: { userId: userData.userId },
    attributes: ['userId', 'loggedIn', 'deviceType'],
    transaction
  })

  if (user) {
    user.loggedIn = 1
    user.deviceType = userData.deviceType
    await user.save({ transaction })
  }
}

export const liveLogoutUser = async msg => {
  if (!msg?.userId) return

  const user = await getOne({
    model: db.User,
    data: { userId: msg.userId },
    attributes: ['userId', 'loggedIn']
  })

  if (user.loggedIn > 0) await user.set({ loggedIn: user.loggedIn - 1 }).save()
}

export const pageValidation = (page, limit, maxSize = 200) => {
  const pageAsNumber = Number.parseInt(page)
  const sizeAsNumber = Number.parseInt(limit)
  let pageNo = 1
  let size = 15

  if (
    Number.isNaN(pageAsNumber) ||
    pageAsNumber < 0 ||
    Number.isNaN(sizeAsNumber) ||
    sizeAsNumber < 0 ||
    sizeAsNumber > maxSize
  ) {
    return { pageNo, size }
  }

  size = sizeAsNumber
  pageNo = pageAsNumber

  return { pageNo, size }
}

export const validateFile = (res, files) => {
  if (!files || files?.length < 1) return 'Documents not found'
  const documentCount = files.length

  for (let document = 0; document < documentCount; document++) {
    if (files[document] && files[document].size > UPLOAD_FILE_SIZE) {
      return 'File size too large'
    }

    if (files[document] && files[document].mimetype) {
      const fileType = files[document].mimetype.split('/')[1]
      const supportedFileType = [
        'png',
        'jpg',
        'jpeg',
        'tiff',
        'svg+xml',
        'pdf',
        'ott',
        'odt'
      ]

      if (!supportedFileType.includes(fileType)) {
        return 'File type not supported'
      }
    }
  }

  return OK
}

export const insertDynamicDataInCmsTemplate = ({ template, dynamicData }) => {
  let returnCms = template

  Object.keys(dynamicData).forEach(dynamicKey => {
    const pattern = new RegExp(`{{{ *${dynamicKey} *}}}`, 'g')
    returnCms = returnCms.replaceAll(pattern, dynamicData[dynamicKey])
  })

  return returnCms
}

export const getDynamicDataValue = async () => {
  const keyData = await getAll({
    model: db.GlobalSetting,
    data: { key: ['SITE_NAME', 'SUPPORT_EMAIL_ADDRESS', 'LOGO_URL'] }
  })
  const dynamicData = {}

  // 'siteName', 'siteLogo', 'supportEmailAddress'
  for (const data of keyData) {
    let key = ''
    if (data.key === 'SITE_NAME') key = 'siteName'
    if (data.key === 'SUPPORT_EMAIL_ADDRESS') key = 'supportEmailAddress'
    if (data.key === 'LOGO_URL') key = 'siteLogo'
    dynamicData[key] = data.value
  }

  return dynamicData
}

export const getClientIp = req => {
  if (req.headers) {
    if (is.ip(req.headers['user-ip'])) {
      return req.headers['user-ip']
    }
    if (is.ip(req.headers['x-client-ip'])) {
      return req.headers['x-client-ip']
    }

    if (is.ip(req.headers['cf-connecting-ip'])) {
      return req.headers['cf-connecting-ip']
    }

    if (is.ip(req.headers['fastly-client-ip'])) {
      return req.headers['fastly-client-ip']
    }

    if (is.ip(req.headers['true-client-ip'])) {
      return req.headers['true-client-ip']
    }

    if (is.ip(req.headers['x-real-ip'])) {
      return req.headers['x-real-ip']
    }

    if (is.ip(req.headers['x-cluster-client-ip'])) {
      return req.headers['x-cluster-client-ip']
    }

    if (is.ip(req.headers['x-forwarded'])) {
      return req.headers['x-forwarded']
    }

    const xForwardedFor = getClientIpFromXForwardedFor(
      req.headers['x-forwarded-for']
    )

    if (is.ip(xForwardedFor)) {
      return xForwardedFor
    }

    if (is.ip(req.headers['forwarded-for'])) {
      return req.headers['forwarded-for']
    }

    if (is.ip(req.headers.forwarded)) {
      return req.headers.forwarded
    }

    if (is.ip(req.headers['x-appengine-user-ip'])) {
      return req.headers['x-appengine-user-ip']
    }
  }

  if (is.existy(req.connection)) {
    if (is.ip(req.connection.remoteAddress)) {
      return req.connection.remoteAddress
    }

    if (
      is.existy(req.connection.socket) &&
      is.ip(req.connection.socket.remoteAddress)
    ) {
      return req.connection.socket.remoteAddress
    }
  }

  if (is.existy(req.socket) && is.ip(req.socket.remoteAddress)) {
    return req.socket.remoteAddress
  }

  if (is.existy(req.info) && is.ip(req.info.remoteAddress)) {
    return req.info.remoteAddress
  }

  if (
    is.existy(req.requestContext) &&
    is.existy(req.requestContext.identity) &&
    is.ip(req.requestContext.identity.sourceIp)
  ) {
    return req.requestContext.identity.sourceIp
  }

  if (req.headers) {
    if (is.ip(req.headers['Cf-Pseudo-IPv4'])) {
      return req.headers['Cf-Pseudo-IPv4']
    }
  }

  if (is.existy(req.raw)) {
    return getClientIp(req.raw)
  }

  return null
}

export const decimalFix = (number, decimalPlaces) => {
  const multiplier = 10 ** decimalPlaces
  return Math.floor(number * multiplier) / multiplier
}

export const prepareImageUrl = imageUrl => {
  if (imageUrl && imageUrl.indexOf('https://') === -1) {
    return `${s3Config.S3_DOMAIN_KEY_PREFIX}${imageUrl}`
  }
  return imageUrl
}

export const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const filterByGameName = (query, search) => {
  search = search
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
  query = { ...query, name: { [Op.iLike]: `%${search}%` } }

  return query
}

export const isDailyAndWelcomeBonusClaimed = async (userId, signupCreatedAt, transaction = {}) => {
  try {
    let isDailyBonusClaimedFlag = false
    let isWelcomeBonusClaimedFlag = false
    const dailyBonusAllowFlag = true
    let dailyBonusClaimedAt = false
    let welcomeBonusAllowFlag = false
    let affiliateBonusClaimedAt = false
    let dailyBonusEndDate = false
    let welcomePurchaseBonusEndTime = false
    let welcomePurchaseBonusApplicable = false
    let welcomePurchaseBonus = false
    let spinWheelBonusAllowFlag = false
    let firstPurchaseBonus = true
    let firstPurchaseBonusActive = false

    const [
      bonuses,
      userBonuses,
      userActivities,
      welcomePurchasePackage,
      depositTransactions
    ] = await Promise.all([
      db.Bonus.findAll({
        where: {
          isActive: true,
          bonusType: {
            [Op.in]: [
              BONUS_TYPE.DAILY_BONUS,
              BONUS_TYPE.WELCOME_BONUS,
              BONUS_TYPE.AFFILIATE_BONUS,
              BONUS_TYPE.WHEEL_SPIN_BONUS,
              BONUS_TYPE.REFERRAL_BONUS,
              BONUS_TYPE.FIRST_PURCHASE_BONUS
            ]
          }
        },
        ...transaction
      }),
      db.UserBonus.findOne({ where: { userId, bonus_type: BONUS_TYPE.AFFILIATE_BONUS }, ...transaction }),
      db.UserActivities.findAll({
        where: {
          userId,
          activityType: {
            [Op.in]: [
              USER_ACTIVITIES_TYPE.DAILY_BONUS_CLAIMED,
              USER_ACTIVITIES_TYPE.DAILY_BONUS_CANCELLED,
              USER_ACTIVITIES_TYPE.WELCOME_BONUS_CLAIMED,
              USER_ACTIVITIES_TYPE.FIRST_PURCHASE_BONUS
            ]
          }
        },
        order: [['created_at', 'DESC']],
        ...transaction
      }),
      db.Package.findOne({
        where: {
          isActive: true,
          [Op.or]: [{ validTill: { [Op.gte]: new Date() } }, { validTill: null }],
          welcomePurchaseBonusApplicable: true
        },
        ...transaction
      }),
      db.TransactionBanking.findAll({
        where: {
          isSuccess: true,
          transactionType: TRANSACTION_TYPE.DEPOSIT,
          actioneeId: userId
        },
        ...transaction
      })
    ])

    // === MAP Bonuses ===
    const bonusMap = {}
    bonuses.forEach(bonus => {
      bonusMap[bonus.bonusType] = bonus
    })

    const isDailyBonusActive = bonusMap[BONUS_TYPE.DAILY_BONUS]
    const isWelcomeBonusActive = bonusMap[BONUS_TYPE.WELCOME_BONUS]
    const isAffiliateBonusActive = bonusMap[BONUS_TYPE.AFFILIATE_BONUS]
    const isSpinWheelBonusActive = bonusMap[BONUS_TYPE.WHEEL_SPIN_BONUS]
    const referralBonusAllowFlag = bonuses.find(b => b.bonusType === BONUS_TYPE.REFERRAL_BONUS && b.minimumPurchase === null)
    const progressiveReferralBonusFlag = bonuses.find(b => b.bonusType === BONUS_TYPE.REFERRAL_BONUS && b.minimumPurchase !== null)
    const isFirstPurchaseBonusActive = bonuses.find(b => b.bonusType === BONUS_TYPE.FIRST_PURCHASE_BONUS && b.minimumPurchase !== null)

    const isWelcomeBonusClaimed = userActivities.find(act => act.activityType === USER_ACTIVITIES_TYPE.WELCOME_BONUS_CLAIMED)
    const isDailyBonusClaimed = userActivities.find(act =>
      [USER_ACTIVITIES_TYPE.DAILY_BONUS_CLAIMED, USER_ACTIVITIES_TYPE.DAILY_BONUS_CANCELLED].includes(act.activityType)
    )
    const isFirstPurchaseBonusClaimed = userActivities.find(act => act.activityType === USER_ACTIVITIES_TYPE.FIRST_PURCHASE_BONUS)

    // Welcome Bonus
    if (isFirstPurchaseBonusActive) firstPurchaseBonusActive = true
    if (isFirstPurchaseBonusClaimed) firstPurchaseBonus = false
    if (isWelcomeBonusActive) welcomeBonusAllowFlag = true
    if (isWelcomeBonusClaimed) isWelcomeBonusClaimedFlag = true

    // Daily Bonus
    if (isDailyBonusActive) {
      const createdAtDate = moment(new Date(isDailyBonusClaimed?.createdAt))
      const currentDateDaily = moment()

      if (isDailyBonusClaimed) dailyBonusClaimedAt = createdAtDate.toDate()
      if (dailyBonusClaimedAt) {
        const claimedAtDate = new Date(createdAtDate)
        dailyBonusEndDate = new Date(claimedAtDate.setDate(claimedAtDate.getDate() + 1))
      }

      if (isDailyBonusClaimed && currentDateDaily.diff(createdAtDate, 'minutes') < 1440) { isDailyBonusClaimedFlag = true } else { isDailyBonusClaimedFlag = false }
    }

    // Affiliate Bonus
    if (isAffiliateBonusActive && userBonuses && userBonuses.status !== BONUS_STATUS.PENDING) {
      affiliateBonusClaimedAt = userBonuses.updatedAt
    }

    // Welcome Purchase Bonus
    if (welcomePurchasePackage && depositTransactions.length === 0) {
      const currentTime = Date.now()
      const signupTime = new Date(signupCreatedAt).getTime()
      const durationMinutes = welcomePurchasePackage.welcomePurchaseBonusApplicableMinutes * 60 * 1000

      if ((currentTime - signupTime) <= durationMinutes) {
        const packagePurchased = depositTransactions.find(txn =>
          txn.packageId === +welcomePurchasePackage.packageId
        )

        if (!packagePurchased) {
          welcomePurchaseBonusEndTime = new Date(signupTime + durationMinutes)
          welcomePurchaseBonus = {
            ...welcomePurchasePackage.get({ plain: true }),
            welcomePurchaseBonusEndTime,
            imageUrl: prepareImageUrl(welcomePurchasePackage.imageUrl)
          }
          welcomePurchaseBonusApplicable = true
        }
      }
    }

    if (isSpinWheelBonusActive) spinWheelBonusAllowFlag = true

    return {
      isDailyBonusClaimed: isDailyBonusClaimedFlag,
      isWelcomeBonusClaimed: isWelcomeBonusClaimedFlag,
      isDailyBonusAllowed: dailyBonusAllowFlag,
      isWelcomeBonusAllowed: welcomeBonusAllowFlag,
      dailyBonusClaimedAt,
      dailyBonusEndDate,
      isPromotionBonusAllowed: !!isAffiliateBonusActive && !!userBonuses,
      promotionBonusClaimedAt: affiliateBonusClaimedAt,
      welcomePurchaseBonusEndTime,
      welcomePurchaseBonus,
      welcomePurchaseBonusApplicable,
      isSpinWheelAllowed: spinWheelBonusAllowFlag,
      isReferralBonusAllowed: !!referralBonusAllowFlag && !!progressiveReferralBonusFlag,
      firstPurchaseBonusActive,
      firstPurchaseBonus
    }
  } catch (error) {
    console.log('Error while finding bonus details', error)
    throw InternalServerErrorType
  }
}

// export const getCurrentISOString = () => {
//   const now = new Date()

//   const year = now.getFullYear()
//   const month = String(now.getMonth() + 1).padStart(2, '0')
//   const day = String(now.getDate()).padStart(2, '0')
//   const hours = String(now.getHours()).padStart(2, '0')
//   const minutes = String(now.getMinutes()).padStart(2, '0')
//   const seconds = String(now.getSeconds()).padStart(2, '0')
//   const milliseconds = String(now.getMilliseconds()).padStart(3, '0')
//   const offsetMinutes = now.getTimezoneOffset()
//   const offsetHours = Math.abs(Math.floor(offsetMinutes / 60))
//   const offsetMinutesRemainder = Math.abs(offsetMinutes % 60)
//   const offsetSign = offsetMinutes > 0 ? '-' : '+'

//   const offsetString = `${offsetSign}${String(offsetHours).padStart(
//     2,
//     '0'
//   )}:${String(offsetMinutesRemainder).padStart(2, '0')}`

//   return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetString}`
// }

export const encodeCredential = key => {
  return CryptoJS.AES.encrypt(key, config.get('jwt.secretKey')).toString()
}

export const decodeCredential = (data, object = false) => {
  return CryptoJS.AES.decrypt(data, config.get('jwt.secretKey')).toString(
    CryptoJS.enc.Utf8
  )
}

export const activityLog = async ({
  userId,
  originalValue,
  changedValue,
  fieldChanged,
  transaction
}) => {
  await createNewEntity({
    model: db.ActivityLog,
    data: {
      adminUserId: userId,
      service: ROLE.USER,
      fieldChanged,
      originalValue,
      changedValue,
      userId,
      moreDetails: { favorite: false }
    },
    transaction
  })
}

export const getResponsibleGamblingData = async ({
  userId,
  responsibleGamblingType
}) => {
  const responsibleGamblingData = await getOne({
    model: db.ResponsibleGambling,
    data: {
      userId,
      responsibleGamblingType,
      status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
    },
    order: [['created_at', 'ASC']]
  })

  return {
    responsibleGamblingData
  }
}

export const setGamePlayRedisToken = async ({ key, token }) => {
  let hours

  const sessionTime = parseInt(
    config.get('jwt.casinoGamePlayExpiry').slice(0, -1)
  )
  const sessionExpiry = config.get('jwt.casinoGamePlayExpiry').slice(-1)

  if (sessionExpiry === 'd') {
    hours = sessionTime * 24
  } else if (sessionExpiry === 'h') {
    hours = sessionTime
  } else {
    hours = 24
  }

  await socketServer.redisClient.set(key, token, 'EX', 60 * 60 * hours)
}

export const setLoginRedisToken = async ({ key, token }) => {
  let minutes

  const sessionTime = parseInt(config.get('jwt.loginTokenExpiry').slice(0, -1))
  const sessionExpiry = config.get('jwt.loginTokenExpiry').slice(-1)

  if (sessionExpiry === 'd') {
    minutes = sessionTime * 24 * 60
  } else if (sessionExpiry === 'h') {
    minutes = sessionTime * 60
  } else if (sessionExpiry === 'm') {
    minutes = sessionTime
  }

  await socketServer.redisClient.set(key, token, 'EX', 60 * minutes)
}

export const getGamePlayRedisToken = async ({ key }) => {
  return await socketServer.redisClient.get(key)
}

export const deleteRedisToken = async ({ key }) => {
  return socketServer.redisClient.del(key)
}

export const resetSocketLoginToken = async ({ key }) => {
  const oldToken = await socketServer.redisClient.get(key)

  return await setLoginRedisToken(key, oldToken)
}

export const getReferredByUser = async referralId => {
  if (!referralId) return null

  const isReferralBonusActive = db.Bonus.findOne({
    where: {
      bonusType: BONUS_TYPE.REFERRAL_BONUS,
      isActive: true
    }
  })

  if (!isReferralBonusActive) return null

  const referringUser = await db.User.findOne({
    attributes: ['userId'],
    where: {
      referralCode: referralId
    },
    raw: true
  })

  return referringUser?.userId
}

export const generateRandomCode = length => {
  const characters = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ'

  const code = Array.from({ length }, (_, index) => {
    return index === 0
      ? characters[Math.floor(Math.random() * (characters.length - 1)) + 1]
      : characters[Math.floor(Math.random() * characters.length)]
  }).join('')

  return code
}

export const generatePersonalBonusCode = async () => {
  let code
  let isUnique = false

  do {
    code = generateRandomCode(8)
    const existingCode = await db.PersonalBonus.findOne({
      where: {
        bonusCode: code
      }
    })

    if (!existingCode) {
      isUnique = true
    }
  } while (!isUnique)

  return code
}

export const getAffiliateByDetails = async (affiliateCode, affiliateId) => {
  if (!affiliateId || !affiliateCode) return false

  const findUser = await db.User.findOne({
    attributes: ['userId'],
    where: {
      affiliateCode
    }
  })

  if (findUser) return 'ClickIdAlreadyInUseErrorType'

  const options = {
    url: `${config.get(
      'scaleo.base_url'
    )}/api/v2/network/affiliates/${affiliateId}`,
    method: 'GET',
    params: {
      'api-key': config.get('scaleo.api_key')
    }
  }

  try {
    const { data } = await axios(options)

    // Status = 1 - Active, 2 - Pending, 3 - Inactive
    if (
      data.code === 200 &&
      data.info?.affiliate?.status === 1 &&
      +data.info?.affiliate?.id === +affiliateId
    ) {
      return true
    } else return false
  } catch (error) {
    console.log(error)
    return false
  }
}

export const findUser = async (where, transaction) => {
  return db.User.findOne({
    where,
    include: [
      {
        model: db.Wallet,
        as: 'userWallet',
        attributes: [
          'totalScCoin',
          'ownerId',
          'gcCoin',
          'scCoin'
        ]
      },
      {
        model: db.ResponsibleGambling,
        attributes: ['status', 'selfExclusion', 'responsibleGamblingType', 'timeBreakDuration', 'permanentSelfExcluded'],
        as: 'responsibleGambling',
        where: {
          [Op.or]: [
            {
              status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE,
              selfExclusion: true,
              timeBreakDuration: {
                [Op.gte]: moment()
              }
            },
            {
              status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE,
              selfExclusion: true,
              permanentSelfExcluded: true
            },
            {
              responsibleGamblingType: RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK,
              status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
            }
          ]
        },
        required: false
      }
    ],
    ...transaction
  })
}

export const scSum = userWallet => {
  return +round(
    +plus(
      +userWallet.scCoin.bsc,
      +userWallet.scCoin.wsc,
      +userWallet.scCoin.psc
    ),
    2
  )
}

export const GSOFT_PROVIDERS_LANG_PARAM = {
  BETSOFT: 'en_US',
  'NUCLEUS GAMING': 'en_US',
  BGAMING: 'en_US',
  DRAGONGAMING: 'en_US',
  'INBET GAMES': 'en_US',
  'FUNKY GAMES': 'EN_SC',
  SPADEGAMING: 'en-sc',
  'MR.SLOTTY': 'en_US',
  'EVOPLAY ENTERTAINMENT': 'ens'
}

export const generateAffiliateClickId = async affiliateId => {
  const options = {
    url: `${config.get('scaleo.base_url')}/api/v2/network/tracker/click`,
    method: 'POST',
    params: {
      'api-key': config.get('scaleo.api_key')
    },
    data: {
      offer_id: '1',
      affiliate_id: `${affiliateId}`
    }
  }
  try {
    const { data } = await axios(options)

    if (data.code === 200) return data?.info?.click_id
    throw data // Because we need to break the code right here.
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const convertToDecimal = amount => {
  amount = `${amount}`
  if (amount.indexOf('.') === -1) {
    return `${amount}.00`
  }
  return `${amount}`
}

export const parseSignedRequest = signedRequest => {
  const secret = config.get('facebook.secret_key') // Use your app secret here
  const [encodedSig, payload] = signedRequest.split('.')
  // decode the data
  const sig = base64UrlDecode(encodedSig)
  const data = JSON.parse(base64UrlDecode(payload))

  // confirm the signature
  const expectedSig = CryptoJS.HmacSHA256(payload, secret).toString(
    CryptoJS.enc.Base64
  )
  if (sig !== expectedSig.toString('binary')) {
    console.error('Bad Signed JSON signature!')
    return null
  }

  return data
}

export const base64UrlDecode = input => {
  input = input.replace(/-/g, '+').replace(/_/g, '/')
  const pad =
    input.length % 4 === 0 ? '' : new Array(5 - (input.length % 4)).join('=')
  return Buffer.from(input + pad, 'base64').toString('binary')
}

// spin-wheel function
export const prepareWheelConfiguration = async (userId, wheelConfigData) => {
  const TODAY_START = new Date().setHours(0, 0, 0, 0)
  const NOW = new Date()
  const result = await db.CasinoTransaction.findAll({
    attributes: [
      'user_id',
      [Sequelize.literal("more_details ->> 'wheelDivisionId'"), 'wheelDivisionId'],
      [Sequelize.fn('COUNT', Sequelize.literal('*')), 'wheelDivisionIdCount']
    ],
    where: {
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      },
      userId: userId,
      actionType: BONUS_TYPE.WHEEL_SPIN_BONUS
    },
    logging: true,
    group: ['user_id', 'wheelDivisionId'],
    raw: true
  })

  // Transform the result into the desired format
  const wheelDivisionCount = result.reduce((accumulator, entry) => {
    const { wheelDivisionId, wheelDivisionIdCount } = entry
    accumulator[wheelDivisionId] = wheelDivisionIdCount
    return accumulator
  }, {})

  wheelConfigData.forEach((wheelData, index) => {
    if (!(isNull(wheelData.playerLimit))) {
      if (!wheelData.playerLimit) {
        wheelConfigData[index].isAllow = false
        return false
      }
      const data = wheelDivisionCount[wheelData.wheelDivisionId]
      if (data && Number(data) >= Number(wheelData.playerLimit)) {
        wheelConfigData[index].isAllow = false
      }
    }
  })
  return wheelConfigData
}

export const generateRandomBase32 = () => {
  const buffer = crypto.randomBytes(15)
  const base32 = encrypt(buffer).replace(/=/g, '').substring(0, 24)
  return base32
}

export const generateHashPassword = (password) => {
  if (!password) return false
  const secretKey = config.get('jwt.passwordHashKey')
  return crypto.createHmac('sha256', secretKey).update(password).digest('hex')
}

export const settingData = async (transaction = {}) => {
  const data = await socketServer.redisClient.get('setting-data')

  if (data) return JSON.parse(data)

  const settings = await db.GlobalSetting.findAll({
    attributes: ['key', 'value'],
    where: {
      key: [
        'MINIMUM_REDEEMABLE_COINS',
        'MAXIMUM_REDEEMABLE_COINS',
        'MINIMUM_SC_SPIN_LIMIT',
        'MINIMUM_GC_SPIN_LIMIT',
        'MAX_SC_VAULT_PER',
        'MAX_GC_VAULT_PER'
      ]
    },
    ...transaction,
    raw: true
  })

  const settingMap = settings.reduce((map, { key, value }) => {
    map[key] = +value || 0
    return map
  }, {})

  const values = {
    minRedeemableCoins: settingMap?.MINIMUM_REDEEMABLE_COINS,
    maxRedeemableCoins: settingMap?.MAXIMUM_REDEEMABLE_COINS,
    scSpinLimit: settingMap?.MINIMUM_SC_SPIN_LIMIT,
    gcSpinLimit: settingMap?.MINIMUM_GC_SPIN_LIMIT,
    maximumScVaultPercentage: settingMap?.MAX_SC_VAULT_PER,
    maximumGcVaultPercentage: settingMap?.MAX_GC_VAULT_PER
  }

  await socketServer.redisClient.set('setting-data', JSON.stringify(values))
  return values
}

export const checkIfEmailExists = async email => {
  if (!email) return false
  email = email.toLowerCase().replace(/\+(.*?)@/g, '@')

  const checkUserExist = await db.User.findOne({
    attributes: [[sequelize.literal('1'), 'exists']],
    where: { email }
  })
  return !!checkUserExist
}

export const isEmailChanged = async email => {
  if (!email) return false
  email = email.toLowerCase().replace(/\+(.*?)@/g, '@')

  const checkEmailExist = await db.ActivityLog.findOne({
    where: { originalValue: email }
  })
  return !!checkEmailExist
}

export function isSuspiciousEmail (email) {
  try {
    if (!email || typeof email !== 'string') {
      return true
    }

    const domain = email.split('@')[1]
    if (!domain) {
      return true
    }

    const normalizedDomain = domain.toLowerCase()

    // Check for punycode encoding
    if (normalizedDomain.startsWith('xn--')) {
      return true
    }

    const isAsciiOnly = normalizedDomain.split('').every(char => char.charCodeAt(0) <= 127)
    if (!isAsciiOnly) {
      return true
    }

    return false
  } catch (err) {
    return true
  }
}

export const findBaseTier = async transaction => {
  try {
    const val = await socketServer.redisClient.get('base-tier-data')

    if (val) return JSON.parse(val)

    const tierData = await db.Tier.findOne({
      attributes: ['tierId', 'level'],
      where: {
        isActive: true,
        requiredXp: 0
      },
      required: true,
      ...transaction
    })

    socketServer.redisClient.set('base-tier-data', JSON.stringify(tierData))
    return tierData
  } catch (err) {
    console.error('ERROR IN FINDING BASE TIER')
  }
}

export async function trackEvent (payload) {
  const scaleoURL = config.get('scaleo.base_url')
  const apiKey = config.get('scaleo.api_key')
  if (!scaleoURL || !apiKey) {
    return false
  }
  const url = `${scaleoURL}/api/v2/network/tracking/event?api-key=${apiKey}`

  const data = {
    ...payload
  }

  try {
    const response = await axios.post(url, data)
    console.log('Scaleo response Data', response.data)

    return true
  } catch (error) {
    console.error('API call error:', error)
    return false
  }
}

export async function trackSokulEvent (payload, event, isSocialSignUp = false) {
  const sokulURL = config.get('sokul.base_url')
  const apiKey = config.get('sokul.api_key')

  if (!sokulURL || !apiKey) return false

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    }
  }

  try {
    switch (event) {
      case 'registration': {
        const url = `${sokulURL}/b/api/customers/`
        let response
        try {
          response = await axios.post(url, payload, headers)
        } catch (error) {
          if (error.response?.status === 400 && error.response?.data?.error === 'customer already exists (by cid)') {
            response = await axios.post(url, {
              dt: payload.dt,
              email: payload.email,
              first_name: payload.first_name,
              last_name: payload.last_name
            }, headers)
          } else {
            throw error
          }
        }

        if (isSocialSignUp && response?.status === 200) {
          await sendBaseEvent(payload, sokulURL, headers)
        }

        return response
      }

      case 'updateUser': {
        return await axios.put(`${sokulURL}/b/api/customers/`, payload, headers)
      }

      case 'baseEvents': {
        return await axios.post(`${sokulURL}/b/api/base_events/`, payload, headers)
      }

      case 'baseEventsRegistration': {
        return await sendBaseEvent(payload, sokulURL, headers)
      }

      default:
        console.error('Invalid event type:', event)
        return false
    }
  } catch (error) {
    console.error('API call error:', error)
    console.error('API call error1:', error?.response?.data)
    return false
  }
}

async function sendBaseEvent (data, sokulURL, headers) {
  try {
    const response = await axios.post(`${sokulURL}/b/api/base_events/`, {
      dt: data.dt,
      email: data.email,
      type: 'reg',
      amount: 0.0
    }, headers)
    console.log('sokul base event reg response Data', response.data)
    return response
  } catch (error) {
    console.error('Base event API call error:', error)
    return false
  }
}
export const generatePaysafeHeaders = () => {
  return {
    Simulator: 'EXTERNAL',
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${config.get('paysafe.username')}:${config.get('paysafe.password')}`).toString('base64')}`
  }
}

export async function getUserKycDetails (applicantId) {
  const url = `${config.get('sumSub.url')}/resources/checks/latest?applicantId=${applicantId}&type=PHONE_CONFIRMATION`
  const timeStamp = Math.floor(Date.now() / 1000)
  const sign = crypto.createHmac('sha256', config.get('sumSub.secret'))
  sign.update(timeStamp + 'GET' + `/resources/checks/latest?applicantId=${applicantId}&type=PHONE_CONFIRMATION`)
  console.log('Fetching KYC from URL:', url)
  try {
    const response = await axios.get(url, {
      headers: {
        'X-App-Token': `${config.get('sumSub.token')}`,
        'X-App-Access-Sig': sign.digest('hex'),
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-App-Access-Ts': `${timeStamp}`
      }
    })
    return response.data
  } catch (error) {
    const status = error?.response?.status
    if (status === 404) {
      return null
    }
    console.error('Error fetching KYC details:', error)
    console.error('Error fetching KYC details descriptions:', {
      url,
      status: error?.response?.status,
      data: error?.response?.data
    })
    throw error
  }
}
export function splitCountryCode (mobileNumber) {
  console.log('mobileNumber by spilt country code========', mobileNumber)
  const match = mobileNumber.match(/^(\+\d{1,3}?)(\d{6,15})$/)
  if (match) {
    return {
      countryCode: match[1],
      phoneNumber: match[2]
    }
  }
  return { error: 'Invalid mobile number format' }
}

/**
 * Get IP whitelist from environment variables
 * @returns {Array} Array of whitelisted IP addresses
 */
export const getIpWhitelist = () => {
  try {
    const whitelistEnv = config.get('ipWhitelist') || ''
    if (!whitelistEnv) {
      return []
    }

    // Split by comma and trim each IP address
    return whitelistEnv
      .split(',')
      .map(ip => ip.trim())
      .filter(ip => ip.length > 0)
  } catch (error) {
    console.error('Error getting IP whitelist:', error)
    return []
  }
}

/**
 * Check if an IP address is in the whitelist
 * @param {string} ipAddress - The IP address to check
 * @returns {boolean} True if IP is whitelisted, false otherwise
 */
export const isIpWhitelisted = (ipAddress) => {
  if (!ipAddress) {
    return false
  }

  const whitelist = getIpWhitelist()
  console.log('🚀 ~ isIpWhitelisted ~ whitelist:', whitelist)

  if (whitelist.length === 0) {
    return false
  }

  return whitelist.includes(ipAddress)
}

// export const encryptData = (data) => {
//   const jsonStr = JSON.stringify(data)
//   const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(config.get('crypto.secret'), 'utf-8'), config.get('crypto.cbc'))
//   let encrypted = cipher.update(jsonStr, 'utf-8', 'base64')
//   encrypted += cipher.final('base64')
//   return encrypted
// }

// export const decryptData = (encryptedData) => {
//   const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(config.get('crypto.secret'), 'utf-8'), config.get('crypto.cbc'))
//   let decrypted = decipher.update(encryptedData, 'base64', 'utf-8')
//   decrypted += decipher.final('utf-8')
//   return JSON.parse(decrypted)
// }

const base64url = (buf) =>
  buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const base64urlDecode = (str) =>
  Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64')

export const encryptData = (data) => {
  const key = crypto.createHash('sha256').update(config.get('crypto.secret')).digest()
  const iv = crypto.randomBytes(12)
  const compressed = zlib.deflateSync(JSON.stringify(data)) // Compress small payloads

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(compressed), cipher.final()])
  const tag = cipher.getAuthTag()

  const payload = Buffer.concat([iv, tag, encrypted])
  return base64url(payload)
}

export const decryptData = (token) => {
  const key = crypto.createHash('sha256').update(config.get('crypto.secret')).digest()
  const buffer = base64urlDecode(token)

  const iv = buffer.slice(0, 12)
  const tag = buffer.slice(12, 28)
  const encrypted = buffer.slice(28)

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return JSON.parse(zlib.inflateSync(decrypted).toString('utf8'))
}

export async function sendSeonKycAmlData (data) {
  const seonURL = config.get('seon.base_url')
  const apiKey = config.get('seon.api_license_key')
  const headers = {
    'Content-Type': 'application/json',
    'X-API-KEY': apiKey
  }

  const requestBody = {
    config: {
      monitoring_required: false,
      monitoring_schedule: 'ON_CHANGE',
      sources: {
        sanction_enabled: true,
        pep_enabled: true,
        watchlist_enabled: true,
        crimelist_enabled: true,
        adversemedia_enabled: false // need to change true for production
      },
      fuzzy_enabled: true,
      fuzzy_config: {
        phonetic_search_enabled: false,
        edit_distance_enabled: true,
        scoring: {
          result_limit: 10,
          score_threshold: 0.585,
          adverse_media_scores: {
            fuzziness: 0,
            exact_match: true,
            force_dob_filter: true,
            force_country_filter: true
          }
        }
      }
    },
    user_fullname: data?.seonKycAmlData?.fullName,
    user_firstname: data?.seonKycAmlData?.firstName,
    user_middlename: data?.seonKycAmlData?.middleName,
    user_lastname: data?.seonKycAmlData?.lastName,
    user_dob: data?.seonKycAmlData?.dateOfBirth,
    // user_pob: "Budapest",
    user_photoid_number: data?.seonKycAmlData?.uniqueId,
    user_id: data?.seonKycAmlData?.userId
    // user_country: "IN"
  }
  console.log('request body==================', requestBody)
  try {
    const response = await axios.post(`${seonURL}/aml-api/v1`, requestBody, { headers })
    console.log('Seon KYC AML response:', response.data)
    return response
  } catch (error) {
    console.error('Seon KYC AML API error:', error.response?.data || error.message)
    return false
  }
}

export async function isKycRequiredUser (TransactionBankingModel, GlobalSettingModel, userId, transaction) {
  const totalScCoin = await TransactionBankingModel.sum('scCoin', {
    where: {
      transactionType: 'deposit',
      status: TRANSACTION_STATUS.SUCCESS,
      actioneeId: userId
    },
    transaction
  }) || 0

  const globalSetting = await GlobalSettingModel.findOne({
    where: { key: 'MAX_DEPOSIT_AMOUNT' },
    transaction
  })

  const maxDepositAmount = Number(globalSetting?.dataValues?.value || 0)

  return totalScCoin > maxDepositAmount
}
/**
 * Retrieves all data associated with a user's fingerprint ID
 * @param {string} userFingerprintId - The fingerprint ID to search for
 * @param {string} fingerprintRequestId - The fingerprint request ID to search for
 * @returns {Object} An object containing all the associated data
 */
export const getUserFingerprintData = async (userFingerprintId, fingerprintRequestId) => {
  if (!userFingerprintId || !fingerprintRequestId) {
    throw new Error('Fingerprint ID and request ID is required')
  }

  try {
    const fingerprintRequestData = await fingerprintClient.getEvent(fingerprintRequestId)

    // Validate that we got valid fingerprint data
    if (!fingerprintRequestData || !fingerprintRequestData.products) {
      console.error('Invalid fingerprint data received')
      throw new Error('Invalid fingerprint data received from service')
    }

    const isBot = fingerprintRequestData.products?.botd?.data?.result !== 'notDetected' // also 'good' bot or 'bad' bot
    const v4IpData = fingerprintRequestData.products?.ipInfo?.data?.v4 || null
    const v6IpData = fingerprintRequestData.products?.ipInfo?.data?.v6 || null
    const requestIpAddress = v4IpData?.address || v6IpData?.address || null

    // Check if IP is whitelisted
    const isWhitelistedIp = isIpWhitelisted(requestIpAddress)

    // Extract geolocation data safely
    const countryCode = v4IpData?.geolocation?.country?.code || v6IpData?.geolocation?.country?.code || null
    const isUSCountry = countryCode === 'US'
    const isUsContinentCode = v4IpData?.geolocation?.continent?.code === 'NA' || v6IpData?.geolocation?.continent?.code === 'NA' || false
    const subdivisionsName = v4IpData?.geolocation?.subdivisions?.[0]?.name || v6IpData?.geolocation?.subdivisions?.[0]?.name || null // example Arizona

    // Extract security data safely
    const vpnResults = fingerprintRequestData.products?.vpn?.data || {}
    const isVpn = vpnResults.result === true
    const vpnConfidence = vpnResults.confidence || 'unknown'
    const isIncognito = fingerprintRequestData.products?.incognito?.data?.result !== false
    const isDeveloperToolsOpen = fingerprintRequestData.products?.developerTools?.data?.result === true
    const isLocationSpoofing = fingerprintRequestData.products?.locationSpoofing?.data?.result === true
    const isStateAllowed = allowedStates.includes(subdivisionsName)

    // If IP is whitelisted, allow access regardless of other checks
    const shouldAllowAccess = isWhitelistedIp || (isUsContinentCode && isStateAllowed && isUSCountry && (!isBot || !(isVpn && vpnConfidence === 'high') || !isIncognito || !isDeveloperToolsOpen || !isLocationSpoofing))

    return {
      shouldAllowAccess,
      requestIpAddress,
      subdivisionsName,
      isWhitelistedIp,
      countryCode,
      isUSCountry,
      isUsContinentCode,
      isStateAllowed
    }
  } catch (error) {
    console.error('Error in getUserFingerprintData:', error)
    // Re-throw with more context
    throw new Error(`Fingerprint validation failed: ${error.message}`)
  }
}
