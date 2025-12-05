import jwt from 'jsonwebtoken'
import ServiceBase from '../../../serviceBase'
import config from '../../../../configs/app.config'
import { sendMail } from '../../../../libs/sendgrid'
import { SUCCESS_MSG } from '../../../../utils/constants/success'
import { CACHE_KEYS, EMAIL_TEMPLATES } from '../../../../utils/constants/constant'
import socketServer from '../../../../libs/socketServer'

export class ResendVerificationEmailService extends ServiceBase {
  async run () {
    const {
      dbModels: { User: UserModel },
      sequelizeTransaction: transaction
    } = this.context

    const globalSetting = await socketServer.redisClient.get(CACHE_KEYS.MAINTENANCE)
    if (globalSetting === 'true') return this.addError('MaintenanceErrorType')

    let { email } = this.args

    email = email.toLowerCase().replace(/\+(.*?)@/g, '@')

    const user = await UserModel.findOne({
      attributes: [
        'userId',
        'uniqueId',
        'username',
        'isEmailVerified',
        'email',
        'newOtpRequested'
      ],
      where: { email },
      transaction
    })

    if (!user) return this.addError('UserNotExistsErrorType')

    if (user.isEmailVerified) return this.addError('EmailAlreadyVerifiedErrorType')

    const otpRequestedTime = new Date(user.newOtpRequested).getTime()
    const currentTime = new Date().getTime()

    const diff = (currentTime - otpRequestedTime) / 1000
    if (diff < 15) return this.addError('WaitTimeErrorType')

    const otp = Math.floor(100000 + Math.random() * 900000)

    const jwtEmailToken = jwt.sign(
      { email, otp },
      config.get('jwt.emailTokenKey'),
      { expiresIn: config.get('jwt.emailTokenExpiry') }
    )

    sendMail({
      email: user.email,
      emailTemplate: EMAIL_TEMPLATES.VERIFY_EMAIL,
      dynamicData: {
        email: user.email,
        otp,
        user_id: user.userId
      }
    })

    await UserModel.update(
      {
        emailToken: jwtEmailToken,
        isEmailVerified: false,
        newOtpRequested: new Date().getTime()
      },
      { where: { email }, transaction }
    )

    return { success: true, data: {}, message: SUCCESS_MSG.RESEND_MAIL_SUCCESS }
  }
}
