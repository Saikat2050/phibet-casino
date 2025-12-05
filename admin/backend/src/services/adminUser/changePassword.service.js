import { appConfig } from '@src/configs'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import bcrypt from 'bcrypt'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    oldPassword: { type: 'string', format: 'password' },
    newPassword: { type: 'string', format: 'password' }
  },
  required: ['adminUserId', 'oldPassword', 'newPassword']
})

export class ChangePasswordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const oldPassword = this.args.oldPassword
    const newPassword = this.args.newPassword

    try {
      const adminUser = await this.context.sequelize.models.adminUser.findOne({ where: { id: this.args.adminUserId } })
      if (!adminUser) return this.addError('AdminUserNotFoundErrorType')

      const samePassword = await bcrypt.compare(newPassword, adminUser.password)
      if (samePassword) return this.addError('OldPasswordAndNewPassowrdMustNotBeSameErrorType')

      const correctOldPassword = await bcrypt.compare(oldPassword, adminUser.password)
      if (!correctOldPassword) return this.addError('PasswordMismatchErrorType')

      const password = await bcrypt.hash(newPassword, appConfig.bcrypt.salt)
      adminUser.password = password
      await adminUser.save()

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
