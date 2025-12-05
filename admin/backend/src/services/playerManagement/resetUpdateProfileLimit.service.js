import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'number' },
    adminUserId: { type: ['string', 'number'] }
  },
  required: ['userId', 'adminUserId']
})

export class ResetUpdateProfileLimitService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { userId } = this.args

    try {
      const user = await sequelize.models.user.findOne({
        where: { id: userId },
        attributes: ['id', 'moreDetails'],
        transaction
      })

      if (!user) return this.addError('UserDoesNotExistsErrorType')
      const userMoreDetails = user.moreDetails ? user.moreDetails : {}
      await user.set({ moreDetails: { ...userMoreDetails, idComplyCount: 0 } }).save({ transaction })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: user?.id,
        entityType: 'user',
        action: 'update',
        changeTableId: user?.id,
        changeTableName: 'users',
        previousData: { moreDetails: userMoreDetails },
        modifiedData: { moreDetails: user.moreDetails },
        service: 'resetUpdateProfileLimit',
        category: tableCategoriesMapping.users
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
