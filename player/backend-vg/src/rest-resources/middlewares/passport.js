import { Op } from 'sequelize'
import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as FirebaseStrategy } from 'passport-firebase'
import db from '../../db/models'
import config from '../../configs/app.config'
import { getOne, updateEntity } from '../../utils/crud'
import { APP_ERROR_CODES } from '../../utils/constants/errors'
import { comparePassword, signAccessToken, decimalFix } from '../../utils/common'
import { DOCUMENTS, RESPONSIBLE_GAMBLING_STATUS, RESPONSIBLE_GAMBLING_TYPE, STATUS, STATUS_VALUE } from '../../utils/constants/constant'

function initPassport () {
  initJwtPassport()
  initFirebasePassport()
}

function initJwtPassport () {
  const opts = {}
  opts.jwtFromRequest = getAccessToken
  opts.secretOrKey = config.get('jwt.loginTokenSecret')

  passport.use(
    'jwt_login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        const detail = await db.User.findOne({
          where: { [Op.or]: { email: email.toLowerCase(), username: email } },
          include: [
            { model: db.Limit, as: 'userLimit', attributes: ['selfExclusion', 'isSelfExclusionPermanent', 'timeLimit'] },
            { model: db.Wallet, as: 'userWallet', attributes: ['totalScCoin', 'walletId', 'amount', 'currencyCode', 'ownerType', 'ownerId', 'non_cash_amount', 'gcCoin', 'scCoin'] },
            { model: db.UserDocument, as: 'userDocuments', attributes: ['documentName', 'documentUrl', 'status'], where: { documentName: { [Op.in]: [DOCUMENTS.ADDRESS, DOCUMENTS.ID, DOCUMENTS.BANK_CHECKING] } }, required: false },
            { model: db.ResponsibleGambling, as: 'responsibleGambling', attributes: ['sessionReminderTime'], where: { status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE, responsibleGamblingType: RESPONSIBLE_GAMBLING_TYPE.SESSION }, required: false }
          ]
        })

        if (!detail) {
          return done({ message: APP_ERROR_CODES.EMAIL_NOT_EXIST_ERROR, code: 'EMAIL_NOT_EXIST_ERROR' }, null)
        }

        const selfExclusion = await db.ResponsibleGambling.findOne({
          where: { status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE, userId: detail.userId, selfExclusion: true }
        })

        if (selfExclusion) {
          return done({ message: APP_ERROR_CODES.SELF_EXCLUDED, code: 'SELF_EXCLUDED' }, null)
        }

        const scCoinFix = {}
        let totalBalance = 0

        detail.userWallet.gcCoin = decimalFix(detail?.userWallet?.gcCoin, 2)
        Object.keys(detail?.userWallet?.scCoin).forEach(key => {
          const fixedValue = decimalFix(detail?.userWallet?.scCoin[key], 2)
          scCoinFix[key] = fixedValue
          totalBalance = totalBalance + fixedValue
        })
        detail.userWallet.scCoin = scCoinFix
        detail.userWallet.totalScCoin = totalBalance
        if (req) {
          if (detail == null) {
            return done({ message: APP_ERROR_CODES.INCORRECT_CREDENTIAL, code: 'INCORRECT_CREDENTIAL' }, null)
          }
        }

        if (!detail.dataValues.isActive) {
          return done({ message: APP_ERROR_CODES.INACTIVE_ADMIN, code: 'IN_ACTIVE_ENTITY' }, null)
        }

        if (detail.dataValues.isBan) {
          return done({ message: APP_ERROR_CODES.USER_BANNED, code: 'USER_BANNED' }, null)
        }

        if (detail.dataValues.passwordAttempt > 4) {
          return done({ message: APP_ERROR_CODES.MAX_PASSWORD_ATTEMPT, code: 'MAX_PASSWORD_ATTEMPT' }, null)
        }

        if (!(await comparePassword(password, detail.password))) {
          await updateEntity({
            model: db.User,
            values: { userId: detail.userId },
            data: { passwordAttempt: detail.passwordAttempt + 1 }
          })
          return done({
            message: APP_ERROR_CODES.INCORRECT_PASSWORD,
            code: 'INCORRECT_PASSWORD'
          }, null)
        }

        detail.dataValues.status = STATUS_VALUE.PENDING
        detail.dataValues.bankStatus = STATUS_VALUE.PENDING

        if (detail?.userDocuments?.length && detail?.userDocuments?.length === 3) {
          if (detail?.userDocuments[0].status === STATUS.APPROVED && detail?.userDocuments[2].status === STATUS.APPROVED) detail.dataValues.status = STATUS_VALUE.APPROVED
          else if (detail?.userDocuments[0].status === STATUS.REJECTED || detail?.userDocuments[2].status === STATUS.REJECTED) detail.dataValues.status = STATUS_VALUE.REJECTED
          else detail.dataValues.status = STATUS_VALUE.REQUESTED

          if (detail?.userDocuments[1].status === STATUS.APPROVED) detail.dataValues.bankStatus = STATUS_VALUE.APPROVED
          else if (detail?.userDocuments[1].status === STATUS.REJECTED) detail.dataValues.bankStatus = STATUS_VALUE.REJECTED
          else detail.dataValues.bankStatus = STATUS_VALUE.REQUESTED
        } else if (detail?.userDocuments?.length && detail?.userDocuments?.length === 2) {
          if (detail?.userDocuments[0].documentName === DOCUMENTS.ADDRESS && detail?.userDocuments[1].documentName === DOCUMENTS.ID) {
            if (detail?.userDocuments[0].status === STATUS.APPROVED && detail?.userDocuments[1].status === STATUS.APPROVED) detail.dataValues.status = STATUS_VALUE.APPROVED
            else if (detail?.userDocuments[0].status === STATUS.REJECTED || detail?.userDocuments[1].status === STATUS.REJECTED) detail.dataValues.status = STATUS_VALUE.REJECTED
            else detail.dataValues.status = STATUS_VALUE.REQUESTED
          }
        }

        const takeABreakTimeStamp = detail.dataValues.selfExclusion
        const selfExclusionTimeStamp = detail.userLimit.selfExclusion
        const isSelfExclusionPermanent = detail.userLimit.selfExclusion
        const sessionTime = detail.userLimit.timeLimit

        const userObj = detail.get({ plain: true })
        userObj.sessionTime = sessionTime

        if (takeABreakTimeStamp && new Date(takeABreakTimeStamp) >= new Date()) {
          userObj.selfExclusion = true
          userObj.expiration = takeABreakTimeStamp
        } else if (selfExclusionTimeStamp && new Date(selfExclusionTimeStamp) >= new Date()) {
          userObj.selfExclusion = true
          userObj.expiration = selfExclusionTimeStamp
        } else if (isSelfExclusionPermanent) {
          userObj.selfExclusion = true
          userObj.expiration = 'permanent'
        } else {
          userObj.selfExclusion = false
          userObj.expiration = null
        }

        const jwtToken = await signAccessToken({
          id: detail.userId,
          email: detail.email,
          name: detail.firstName + ' ' + detail.lastName,
          uuid: detail.uniqueId,
          sessionTime
        })

        const minimumCoins = await getOne({ model: db.GlobalSetting, data: { key: 'MINIMUM_REDEEMABLE_COINS' }, attributes: ['value'] })
        userObj.minRedeemableCoins = minimumCoins?.value

        userObj.accessToken = jwtToken
        return done(null, userObj)
      }
    ))

  passport.use(new JwtStrategy(opts, async function (jwtPayload, done) {
    let detail
    if (jwtPayload.email) {
      detail = await getOne({
        model: db.User,
        data: { [Op.or]: { email: jwtPayload.email.toLowerCase(), username: jwtPayload.email } },
        include: [
          { model: db.Limit, as: 'userLimit', attributes: ['selfExclusion', 'isSelfExclusionPermanent'] },
          { model: db.Wallet, as: 'userWallet' },
          { model: db.UserDocument, as: 'userDocuments', attributes: ['userDocumentId', 'documentName', 'documentUrl'] }
        ]
      })

      if (detail) {
        return done(null, { detail })
      } else {
        return done({ message: APP_ERROR_CODES.USER_NOT_FOUND })
      }
    }
    return done({ message: APP_ERROR_CODES.INVALID_TOKEN })
  }))

  passport.serializeUser((detail, done) => {
    done(null, detail)
  })

  passport.deserializeUser((obj, done) => {
    done(null, obj)
  })
}
function initFirebasePassport () {
  const opts = {}
  opts.issuer = `https://securetoken.google.com/${process.env.FIREBASE_PROJECTID}`
  opts.audience = process.env.FIREBASE_PROJECTID
  passport.use('firebase_login', new FirebaseStrategy(opts, async (jwtPayload, done) => {
    const detail = await db.User.findOne({
      where: { firebaseUid: jwtPayload.sub },
      attributes: ['firstName', 'lastName', 'address', 'country', 'dateOfBirth', 'phone', 'phoneCode', 'userId', 'email', 'firebaseUid', 'isOnboardingCompleted', 'isUserGotWelcomeBonus', 'signInCount', 'username', 'signInIp', 'isActive', 'lastLoginDate',
        'kycStatus', 'zipCode', 'state', 'city', 'firebaseUid', 'loggedIn', 'selfExclusion', 'locale', 'uniqueId', 'phoneVerified', 'profileImage', 'gender', 'veriffStatus'],
      include: [
        { model: db.Limit, as: 'userLimit', attributes: ['selfExclusion', 'isSelfExclusionPermanent', 'timeLimit'] },
        { model: db.Wallet, as: 'userWallet', attributes: ['totalScCoin', 'walletId', 'amount', 'currencyCode', 'ownerType', 'ownerId', 'non_cash_amount', 'gcCoin', 'scCoin'] },
        { model: db.UserDocument, as: 'userDocuments', attributes: ['userDocumentId', 'documentName', 'documentUrl'] }
      ]
    })

    if (!detail) {
      return done({ message: APP_ERROR_CODES.EMAIL_NOT_EXIST_ERROR, code: 'INCORRECT_CREDENTIAL' }, null)
    }

    const scCoinFix = {}
    let totalBalance = 0

    detail.userWallet.gcCoin = decimalFix(detail?.userWallet?.gcCoin, 2)
    Object.keys(detail?.userWallet?.scCoin).forEach(key => {
      const fixedValue = decimalFix(detail?.userWallet?.scCoin[key], 2)
      scCoinFix[key] = fixedValue
      totalBalance = totalBalance + fixedValue
    })
    detail.userWallet.scCoin = scCoinFix
    detail.userWallet.totalScCoin = totalBalance

    if (!detail.dataValues.isActive) {
      return done({ message: APP_ERROR_CODES.INACTIVE_ADMIN, code: 'IN_ACTIVE_ENTITY' }, null)
    }

    const takeABreakTimeStamp = detail.dataValues.selfExclusion
    const selfExclusionTimeStamp = detail.userLimit.selfExclusion
    const isSelfExclusionPermanent = detail.userLimit.selfExclusion
    const sessionTime = detail.userLimit.timeLimit

    const userObj = detail.get({ plain: true })
    userObj.sessionTime = sessionTime

    if (takeABreakTimeStamp && new Date(takeABreakTimeStamp) >= new Date()) {
      userObj.selfExclusion = true
      userObj.expiration = takeABreakTimeStamp
    } else if (selfExclusionTimeStamp && new Date(selfExclusionTimeStamp) >= new Date()) {
      userObj.selfExclusion = true
      userObj.expiration = selfExclusionTimeStamp
    } else if (isSelfExclusionPermanent) {
      userObj.selfExclusion = true
      userObj.expiration = 'permanent'
    } else {
      userObj.selfExclusion = false
      userObj.expiration = null
    }

    const minimumCoins = await getOne({ model: db.GlobalSetting, data: { key: 'MINIMUM_REDEEMABLE_COINS' }, attributes: ['value'] })
    userObj.minRedeemableCoins = minimumCoins?.value

    return done(null, userObj)
  }
  ))

  passport.use(new FirebaseStrategy(opts, async function (jwtPayload, done) {
    let detail
    if (jwtPayload.sub) {
      detail = await getOne({
        model: db.User,
        data: { firebaseUid: jwtPayload.sub },
        include: [
          { model: db.Limit, as: 'userLimit', attributes: ['selfExclusion', 'isSelfExclusionPermanent'] },
          { model: db.Wallet, as: 'userWallet' },
          { model: db.UserDocument, as: 'userDocuments', attributes: ['userDocumentId', 'documentName', 'documentUrl'] }
        ]
      })

      if (detail) {
        return done(null, { detail })
      } else {
        return done({ message: APP_ERROR_CODES.USER_NOT_FOUND })
      }
    }
    return done({ message: APP_ERROR_CODES.INVALID_TOKEN })
  }))

  passport.serializeUser((detail, done) => {
    done(null, detail)
  })

  passport.deserializeUser((obj, done) => {
    done(null, obj)
  })
}
const getAccessToken = function (req) {
  return (req.cookies.accessToken ? req.cookies.accessToken : null)
}

module.exports = initPassport
