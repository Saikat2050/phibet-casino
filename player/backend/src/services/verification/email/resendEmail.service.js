import { appConfig } from '@src/configs'
import ServiceBase from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import Jwt from 'jsonwebtoken'
import { JWT_TOKEN_TYPES } from '@src/utils/constants/app.constants'
import { EMAIL_TEMPLATE_EVENT_TYPES } from '@src/utils/constants/public.constants.utils'
import { SendEmailService } from '@src/services/emailTemplate/sendMail.service'
import _ from 'lodash'

export class ResendEmailService extends ServiceBase {
  async run () {
    const userModel = this.context.sequelize.models.user
    try {
      const user = await userModel.findOne({ where: { id: this.args.userId }, attributes: ['id', 'emailVerified', 'emailToken', 'newEmailRequested', 'email', 'username'] })
      if (!user) return this.addError('UserDoesNotExistsErrorType')
      if (user.emailVerified) return this.addError('EmailAlreadyVerifiedErrorType')

      const emailVerificationToken = Jwt.sign({ userId: this.args.userId, type: JWT_TOKEN_TYPES.VERIFY_EMAIL, date: new Date() }, appConfig.jwt.secret, { expiresIn: appConfig.jwt.expiry })

      const emailSent = await SendEmailService.execute({
        email: user.email,
        firstName: user.username,
        verificationLink: `${appConfig.app.userFeUrl}/verify-email?token=${emailVerificationToken}`,
        url: appConfig.app.userFeUrl,
        supportEmail: 'noreply@phibet.com',
        eventType: EMAIL_TEMPLATE_EVENT_TYPES.EMAIL_VERIFICATION
      })

      if (_.size(emailSent.errors)) return this.mergeErrors(emailSent.errors)
      if (emailSent.result.data?.$metadata?.httpStatusCode === 200) {
        await this.context.sequelize.models.user.update({ emailToken: emailVerificationToken, newEmailRequested: new Date() }, { where: { id: this.args.userId } })
      }

      return { success: emailSent?.result }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
