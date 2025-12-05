import { Op } from 'sequelize'
import ServiceBase from '../serviceBase'
import jwt from 'jsonwebtoken'
import { activityLog } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { EMAIL_TEMPLATES } from '../../utils/constants/constant'
import config from '../../configs/app.config'
import { sendMail } from '../../libs/sendgrid'
export class UpdateEmailService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail: user }
      },
      dbModels: { User: UserModel },
      sequelizeTransaction: transaction
    } = this.context

    const { email } = this.args

    if (String(email).toLowerCase() === String(user.email).toLowerCase()) {
      return this.addError('EmailIsSameAsPreviousErrorType', '')
    }

    const emailAlreadyExist = await UserModel.count({
      where: {
        email: email.toLowerCase(),
        userId: { [Op.notIn]: [user.userId] }
      }
    })

    if (emailAlreadyExist) return this.addError('EmailAlreadyExistErrorType', '')

    const OTP = Math.floor(100000 + Math.random() * 900000)
    const emailToken = jwt.sign(
      { email, otp: OTP },
      config.get('jwt.emailTokenKey'),
      { expiresIn: config.get('jwt.emailTokenExpiry') }
    )

    const [data] = await Promise.all([
      UserModel.update({ email: email.toLowerCase(), emailToken, newOtpRequested: new Date(), isEmailVerified: false }, {
        where: {
          userId: user.userId
        },
        returning: true,
        transaction
      }),
      activityLog({
        adminUserId: user.userId,
        fieldChanged: 'Email',
        originalValue: user.email,
        changedValue: email,
        transaction
      }),
      sendMail({
        email,
        emailTemplate: EMAIL_TEMPLATES.VERIFY_EMAIL,
        dynamicData: {
          email,
          otp: OTP,
          user_id: user.userId,
          userName: user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : user.firstName || 'User',
          name: user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : user.firstName || 'User'
        }
      })
    ])

    return {
      success: true,
      data,
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
