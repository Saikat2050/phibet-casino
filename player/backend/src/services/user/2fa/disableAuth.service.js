import bcrypt from 'bcrypt'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    enable: { type: 'boolean' },
    password: { type: 'string' }
  },
  required: ['userId']
})

export class EnableDisableAuthService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const transaction = this.context.sequelizeTransaction

      const user = await this.context.sequelize.models.user.findOne({
        attributes: ['id', 'authEnable', 'username', 'email', 'password'],
        where: { id: this.args.userId },
        transaction
      })

      if (!user) return this.addError('UserDoesNotExistsErrorType')
      if (!this.args.enable) {
        if (!this.args.password) return this.addError('PasswordRequiredErrorType')
        const passwordMatch = await bcrypt.compare(this.args.password, user.password)
        if (!passwordMatch) {
          return this.addError('WrongPasswordErrorType')
        }
      }
      user.authEnable = this.args.enable
      await user.save({ transaction })

      return { authEnable: this.args.enable, success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
