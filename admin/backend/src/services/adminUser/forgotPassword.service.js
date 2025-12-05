// import { appConfig } from '@src/configs/app.config'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
// import { JWT_TOKEN_TYPES } from '@src/utils/constants/app.constants'
// import Jwt from 'jsonwebtoken'

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
    const { email } = this.args

    try {
      const adminUser = await this.context.sequelize.models.adminUser.findOne({ where: { email: email.toLowerCase() }, attributes: ['id', 'email', 'username'] })
      if (!adminUser) return this.addError('AdminUserNotFoundErrorType')

      // const token = Jwt.sign({ adminUserId: adminUser.id, type: JWT_TOKEN_TYPES.FORGOT_PASSWORD }, appConfig.jwt.secret, { expiresIn: appConfig.jwt.expiry })
      // const { result: emailSent } = await SendForgotPasswordEmailService.execute({ token, email, username: adminUser.username }, this.context)

      return { emailSent: false }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
