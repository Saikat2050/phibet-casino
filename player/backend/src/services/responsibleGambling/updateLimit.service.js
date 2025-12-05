import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { dayjs } from '@src/libs/dayjs'
import ServiceBase from '@src/libs/serviceBase'
import { USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    limitId: { type: 'string' },
    value: { type: 'string' }
  },
  required: ['userId', 'limitId', 'value']
})

export class UpdateLimitService extends ServiceBase {
  get constraints () {
    return constraints
  }

  /**
   * @param {string} key
   */
  getExpireAt (key) {
    if (key.includes('daily')) return dayjs().add(24, 'h')
    if (key.includes('weekly')) return dayjs().add(1, 'w')
    if (key.includes('monthly')) return dayjs().add(24, 'M')
  }

  async run () {
    const transaction = this.context.sequelizeTransaction

    try {
      const value = this.args.value
      if (isNaN(value) || !isFinite(value)) return this.addError('InvalidValueErrorType')

      const limit = await this.context.sequelize.models.userLimit.findOne({
        where: { id: this.args.limitId, userId: this.args.userId },
        transaction
      })
      if (!limit || limit.key === USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.SELF_EXCLUSION) return this.addError('LimitNotFoundErrorType')
      limit.expireAt = this.getExpireAt(limit.key)
      limit.value = (
        limit.key === USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.DAILY_BET_LIMIT ||
        limit.key === USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.MONTHLY_BET_LIMIT ||
        limit.key === USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.WEEKLY_BET_LIMIT
      )
        ? value.split('.')[0]
        : value
      await limit.save({ transaction })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
