import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES } from '@src/utils/constants/public.constants.utils'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    lossLimit: { type: ['string', 'number'] },
    timePeriod: { type: 'string', enum: ['daily', 'weekly', 'monthly'] },
    reset: { type: 'boolean' },
    type: { type: 'string', enum: ['loss'] },
    adminUserId: { type: ['string', 'number'], nullable: true }
  },
  required: ['userId', 'lossLimit', 'timePeriod']
})

/**
 * Service to update a user's loss limit (daily, weekly, or monthly).
 * Updates the user_limits table for the specified user and time period.
 */
export class UpdateLossLimitService extends ServiceBase {
  /**
   * Returns the AJV constraints for validating input arguments.
   */
  get constraints () {
    return constraints
  }

  /**
   * Updates the loss limit for a user for the specified time period.
   * @returns {Promise<{ userLimit: object }>} The updated userLimit row.
   */
  async run () {
    const { userId, lossLimit, timePeriod, reset, adminUserId } = this.args
    const transaction = this.context.sequelizeTransaction
    const { userLimit: userLimitModel } = this.context.sequelize.models

    let key
    switch (timePeriod) {
      case 'daily':
        key = USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.DAILY_LOSS_LIMIT
        break
      case 'weekly':
        key = USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.WEEKLY_LOSS_LIMIT
        break
      case 'monthly':
        key = USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.MONTHLY_LOSS_LIMIT
        break
      default:
        return this.addError('InvalidTimePeriodErrorType')
    }

    try {
      const userLimit = await userLimitModel.findOne({
        where: { userId, key },
        transaction
      })
      if (!userLimit) return this.addError('LimitDoesNotExistsErrorType')

      const previousData = {
        value: userLimit.value
      }

      const limitData = reset ? { value: '' } : { value: lossLimit }

      userLimit.value = limitData.value
      await userLimit.save({ transaction })

      const modifiedData = {
        value: userLimit.value
      }

      logAdminActivity({
        adminUserId,
        entityId: userLimit?.id,
        entityType: 'userLimit',
        action: 'update',
        changeTableId: userLimit?.id,
        changeTableName: 'user_limits',
        previousData: { lossLimits: previousData },
        modifiedData: { lossLimits: modifiedData },
        service: 'updateLossLimit',
        category: tableCategoriesMapping.user_limits
      })

      return { userLimit }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
