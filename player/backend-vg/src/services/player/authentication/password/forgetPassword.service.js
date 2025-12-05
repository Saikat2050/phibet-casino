import jwt from 'jsonwebtoken'
import ServiceBase from '../../../serviceBase'
import config from '../../../../configs/app.config'
import { sendMail } from '../../../../libs/sendgrid'
import { SUCCESS_MSG } from '../../../../utils/constants/success'
import { CACHE_KEYS, EMAIL_TEMPLATES, SEND_EMAIL_TYPES } from '../../../../utils/constants/constant'
import socketServer from '../../../../libs/socketServer'

export class ForgetPasswordService extends ServiceBase {
  async run () {
    try {
      let { email } = this.args
      const {
        dbModels: { User: UserModel },
        sequelizeTransaction: transaction
      } = this.context

      const globalSetting = await socketServer.redisClient.get(CACHE_KEYS.MAINTENANCE)
      if (globalSetting === 'true') return this.addError('MaintenanceErrorType')

      email = email.toLowerCase().replace(/\+(.*?)@/g, '@')

      const where = { email }

      const checkUserExist = await UserModel.findOne({
        attributes: [
          'userId',
          'email',
          'isEmailVerified',
          'uniqueId',
          'username',
          'password',
          'newOtpRequested',
          'firstName',
          'lastName'
        ],
        where: where,
        transaction
      })

      if (!checkUserExist) return this.addError('UserNotExistsErrorType')
      if (!checkUserExist.password) return this.addError('UserAssociatedWithSocialLoginErrorType')

      // if (!checkUserExist?.isEmailVerified) {
      //   return this.addError('EmailNotVerifiedErrorType')
      // }

      const authConfig = config.getProperties().jwt
      const token = jwt.sign(
        { userId: checkUserExist.uniqueId },
        authConfig.resetPasswordKey,
        {
          expiresIn: authConfig.resetPasswordExpiry
        }
      )
      const userToken = {}
      userToken.token = token
      userToken.userId = checkUserExist.userId
      userToken.tokenType = SEND_EMAIL_TYPES.RESET_PASSWORD
      await UserModel.update(
        {
          newPasswordKey: userToken.token,
          newPasswordRequested: new Date().getTime()
        },
        {
          where: { email }
        },
        { transaction }
      )

      const data = {
        email: checkUserExist.email,
        user_id: checkUserExist.userId,
        name: checkUserExist.firstName && checkUserExist.lastName ? checkUserExist.firstName + ' ' + checkUserExist.lastName : checkUserExist.firstName || 'User'
      }

      sendMail({
        email: checkUserExist.email,
        token: token,
        emailTemplate: EMAIL_TEMPLATES.FORGET_PASSWORD,
        dynamicData: data
      })

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
