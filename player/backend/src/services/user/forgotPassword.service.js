import _ from 'lodash'
import Jwt from 'jsonwebtoken'
import ajv from '@src/libs/ajv'
import { appConfig } from '@src/configs'
import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'
import { JWT_TOKEN_TYPES } from '@src/utils/constants/app.constants'
import { SendResetPasswordEmailService } from '../emailTemplate/sendResetPasswordEmail.service'
import { EMAIL_TEMPLATE_EVENT_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    email: { type: 'string' }
  },
  required: ['email']
})

export class ForgotPasswordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    let success = false
    try {
      const user = await this.context.sequelize.models.user.findOne({ attributes: ['id', 'email', 'emailVerified', 'newPasswordKey', 'email', 'username'], where: { email: this.args.email }, transaction })
      if (!user) return this.addError('UserDoesNotExistsErrorType')
      if (!user.emailVerified) return this.addError('EmailNotVerifiedErrorType')

      const token = Jwt.sign({ userId: user.id, type: JWT_TOKEN_TYPES.FORGOT_PASSWORD, date: new Date() }, appConfig.jwt.secret, { expiresIn: appConfig.jwt.expiry })

      const emailSent = await SendResetPasswordEmailService.execute({
        email: user.email,
        firstName: user.username,
        verificationLink: `${appConfig.app.userFeUrl}/forgot-password?token=${token}`,
        url: appConfig.app.userFeUrl,
        supportEmail: 'noreply@phibet.com',
        eventType: EMAIL_TEMPLATE_EVENT_TYPES.RESET_PASSWORD
      })

      if (_.size(emailSent.errors)) return this.mergeErrors(emailSent.errors)
      if (emailSent.result.data?.$metadata?.httpStatusCode === 200) {
        await this.context.sequelize.models.user.update({ newPasswordKey: token, newPasswordRequested: new Date() }, { where: { email: this.args.email } })
        success = true
      }
      return { success }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
