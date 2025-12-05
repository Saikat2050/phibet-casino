import bcrypt from 'bcrypt'
import ajv from '@src/libs/ajv'
import { appConfig } from '@src/configs'
import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    userId: { type: 'number' },
    newPassword: { type: 'string', format: 'password' }
  },
  required: ['userId', 'newPassword']
})

export class UpdatePlayerPasswordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const user = await await sequelize.models.user.findOne({ where: { id: this.args.userId }, attributes: ['id', 'password'] })
      if (!user) return this.addError('UserDoesNotExistsErrorType')

      const previousData = user.password
      user.password = await bcrypt.hash(this.args.newPassword, appConfig.bcrypt.salt)
      await user.save()

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: this.args.userId,
        entityType: 'user',
        action: 'update',
        changeTableId: this.args.userId,
        changeTableName: 'users',
        previousData: { password: previousData },
        modifiedData: { password: user.password },
        service: 'updatePlayerPassword',
        category: tableCategoriesMapping.users
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
