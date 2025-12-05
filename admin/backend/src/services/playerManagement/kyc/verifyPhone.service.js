import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    userId: { type: 'number' }
  },
  required: ['userId']
})

export class VerifyPhoneService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { userId } = this.args

    try {
      const user = await sequelize.models.user.findOne({
        where: { id: userId },
        attributes: ['id', 'email', 'phoneVerified', 'username', 'phone', 'phoneCode'],
        transaction
      })

      if (!user) return this.addError('UserDoesNotExistsErrorType')
      if (!user.phoneCode || !user.phone) return this.addError('PhoneRequiredErrorType')

      const previousData = user.phoneVerified
      await user.set({ phoneVerified: true }).save({ transaction })
      const modifiedData = user.phoneVerified

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: user?.id,
        entityType: 'user',
        action: 'update',
        changeTableId: user?.id,
        changeTableName: 'users',
        previousData: { phoneVerified: previousData },
        modifiedData: { phoneVerified: modifiedData },
        service: 'verifyPhone',
        category: tableCategoriesMapping.users
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
