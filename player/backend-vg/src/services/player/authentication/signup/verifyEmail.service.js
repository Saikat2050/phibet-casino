import moment from 'moment'
import jwt from 'jsonwebtoken'
import ServiceBase from '../../../serviceBase'
import config from '../../../../configs/app.config'
import { sendMail } from '../../../../libs/sendgrid'
import { getUserTierDetails } from '../../../../helpers/tiers.helper'
import { UserActivityService } from '../../../../services/player/userActivity.service'
import { CACHE_KEYS, EMAIL_TEMPLATES, KYC_STATUS, SIGN_IN_METHOD, SOKUL_KYC_STATUS, USER_ACTIVITIES_TYPE } from '../../../../utils/constants/constant'
import { activityLog, findUser, getClientIp, isDailyAndWelcomeBonusClaimed, setLoginRedisToken, settingData, signAccessToken, trackEvent, trackSokulEvent } from '../../../../utils/common'
import socketServer from '../../../../libs/socketServer'

export class VerifyEmailService extends ServiceBase {
  async run () {
    const {
      dbModels: { User: UserModel },
      sequelizeTransaction: transaction
    } = this.context

    const globalSetting = await socketServer.redisClient.get(CACHE_KEYS.MAINTENANCE)
    if (globalSetting === 'true') return this.addError('MaintenanceErrorType')

    let { otp, email, deviceType } = this.args
    email = email.toLowerCase().replace(/\+(.*?)@/g, '@')

    const userData = await findUser({ email }, transaction)

    if (!userData) return this.addError('UserNotExistsErrorType')
    if (userData.isEmailVerified) return this.addError('EmailAlreadyVerifiedErrorType')

    const tokenData = jwt.verify(userData.emailToken, config.get('jwt.emailTokenKey'))
    if (!tokenData) return this.addError('VerifyEmailTokenErrorType')
    if (+otp !== +tokenData.otp) return this.addError('InvalidOtpErrorType')

    const then = moment().subtract(10, 'minutes').toDate()
    if (then > userData.newOtpRequested) return this.addError('ExpiredOtpErrorType')

    await UserModel.update(
      {
        emailToken: null,
        isEmailVerified: true,
        lastLoginDate: new Date(),
        deviceType: deviceType ?? 'desktop',
        signInCount: +userData.signInCount + 1,
        signInIp: getClientIp(this.context.req),
        kycStatus: KYC_STATUS.ACCOUNT_EMAIL_VERIFIED
      }, {
        where: {
          userId: userData.userId
        },
        transaction
      })

    const jwtToken = await signAccessToken({ id: userData.userId, email: userData.email, name: `${userData.firstName} ${userData.lastName}`, uuid: userData.uniqueId })

    userData.dataValues.accessToken = jwtToken

    const [setting, claimedResponse, tierDetail] = await Promise.all([
      settingData({ transaction }),
      isDailyAndWelcomeBonusClaimed(userData.userId, userData.createdAt, { transaction }),
      getUserTierDetails(userData.userId, false, transaction),
      activityLog({ userId: userData.userId, originalValue: userData.kycStatus, changedValue: KYC_STATUS.ACCOUNT_EMAIL_VERIFIED, fieldChanged: 'kycStatus', transaction }),
      UserActivityService.execute({ activityType: USER_ACTIVITIES_TYPE.LOGIN, userId: userData.userId, ipAddress: getClientIp(this.context.req) }, this.context),
      setLoginRedisToken({ key: `user:${userData.uniqueId}`, token: jwtToken })
    ])
    sendMail({ email: userData.email, emailTemplate: EMAIL_TEMPLATES.WELCOME_MAIL, dynamicData: { email: userData.email, user_id: userData.userId, name: userData.firstName && userData.lastName ? userData.firstName + ' ' + userData.lastName : userData.firstName || 'User' } })
    delete userData.userId
    delete userData.password
    userData.dataValues = { ...userData.dataValues, ...claimedResponse, tierDetail, ...setting }
    if (userData?.affiliateCode) {
      const scalioData = {
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        type: 'reg',
        click_id: userData?.affiliateCode.replaceAll('-', ''),
        adv_user_id: userData?.userId,
        amount: 0,
        currency: 'USD',
        event_id: userData?.userId
      }
      await trackEvent(scalioData)
    }
    if (userData?.signInMethod !== SIGN_IN_METHOD.FACEBOOK) {
      console.log('????????????????>>>>>>>>sokul sign in method check')
      await trackSokulEvent({
        dt: new Date(userData?.createdAt).toISOString().replace('T', ' ').split('.')[0],
        email: email,
        kyc_status: SOKUL_KYC_STATUS.ACCOUNT_EMAIL_VERIFIED
      }, 'baseEventsRegistration')
    }
    return {
      user: { ...userData.dataValues, signInCount: userData.signInCount + 1, isEmailVerified: true },
      success: true,
      message: 'User Logged in Successfully!'
    }
  }
}
