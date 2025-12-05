import { appConfig } from '@src/configs'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { JWT_TOKEN_TYPES } from '@src/utils/constants/app.constants'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const constraints = ajv.compile({
  type: 'object',
  properties: {
    token: { type: 'string' },
    newPassword: { type: 'string' }
  },
  required: ['token', 'newPassword']
})

export class VerifyForgotPasswordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const data = jwt.verify(this.args.token, appConfig.jwt.secret)
      const transaction = this.context.sequelizeTransaction
      if (!data) return this.addError('InvalidTokenErrorType')

      if (data.type !== JWT_TOKEN_TYPES.FORGOT_PASSWORD) return this.addError('WrongTokenTypeErrorType')
      const user = await this.context.sequelize.models.user.findOne({ attributes: ['id', 'password', 'newPasswordKey', 'newPasswordRequested'], where: { id: data.userId }, transaction })
      if (!user) return this.addError('UserDoesNotExistsErrorType')

      user.password = await bcrypt.hash(this.args.newPassword, appConfig.bcrypt.salt)
      if (user.newPasswordKey && user.newPasswordKey !== this.args.token) return this.addError('InvalidTokenErrorType')
      user.newPasswordKey = ''
      user.newPasswordRequested = null

      await user.save({ transaction })
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
