import { appConfig } from '@src/configs/app.config'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { JWT_TOKEN_TYPES } from '@src/utils/constants/app.constants'
import bcrypt from 'bcrypt'
import Jwt from 'jsonwebtoken'

const schema = {
  type: 'object',
  properties: {
    token: { type: 'string' },
    password: { type: 'string', format: 'password' }
  },
  required: ['token', 'password']
}

const constraints = ajv.compile(schema)

export class VerifyForgetPasswordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const decodedData = Jwt.verify(this.args.token, appConfig.jwt.secret)
      if (!decodedData) return this.addError('InvalidTokenErrorType')
      if (decodedData.type !== JWT_TOKEN_TYPES.FORGOT_PASSWORD) return this.addError('InvalidTokenErrorType')

      const adminUser = await this.context.sequelize.models.adminUser.findOne({ where: { id: decodedData.adminUserId } })
      if (!adminUser) return this.addError('InvalidTokenErrorType')

      const newPassword = await bcrypt.hash(this.args.password, appConfig.bcrypt.salt)
      adminUser.password = newPassword
      await adminUser.save()

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
