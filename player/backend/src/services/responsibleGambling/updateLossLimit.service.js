import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import bcrypt from 'bcrypt'
import { USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    password: { type: 'string' },
    reset: { type: 'boolean' },
    daily: { type: ['string', 'null'] },
    weekly: { type: ['string', 'null'] },
    monthly: { type: ['string', 'null'] }
  },
  required: ['userId', 'password']
})

/**
 * Service to update or reset loss limits (daily, weekly, monthly) for a user.
 * Enforces password verification, limit relationship validation, and 24h cooldown on updates/resets.
 */
export class UpdateLossLimitService extends ServiceBase {
  get constraints () {
    return constraints
  }

  /**
   * Updates or resets loss limits for a user.
   * @returns {Promise<{success: boolean, updated?: object|string}>}
   */
  async run () {
    const transaction = this.context.sequelizeTransaction
    const { userLimit: userLimitModel, user: userModel } = this.context.sequelize.models
    const { userId, password, reset, daily, weekly, monthly } = this.args
    try {
      const user = await userModel.findOne({ where: { id: userId }, transaction })
      if (!user) return this.addError('UserDoesNotExistsErrorType')
      const passwordMatch = await bcrypt.compare(password, user.password)
      if (!passwordMatch) return this.addError('WrongPasswordErrorType')
      if (!reset && (daily === undefined || weekly === undefined || monthly === undefined)) {
        return this.addError('InvalidValueErrorType', 'All of daily, weekly, and monthly must be provided')
      }
      if (!reset) {
        const d = Number(daily)
        const w = Number(weekly)
        const m = Number(monthly)
        if (isNaN(d) || isNaN(w) || isNaN(m)) return this.addError('InvalidValueErrorType', 'Limits must be numbers')
        if (w < d) return this.addError('InvalidValueErrorType', 'Weekly limit must be greater than or equal to daily limit')
        if (m < w || m < d) return this.addError('InvalidValueErrorType', 'Monthly limit must be greater than or equal to both daily and weekly limits')
      }
      const keys = [USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.DAILY_LOSS_LIMIT, USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.WEEKLY_LOSS_LIMIT, USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.MONTHLY_LOSS_LIMIT]
      const limits = await userLimitModel.findAll({ where: { userId, key: keys }, transaction })
      if (limits.length !== keys.length) return this.addError('LimitNotFoundErrorType', 'One or more limits not found')
      const now = new Date()
      if (reset) {
        if (limits.some(l => l.expireAt && new Date(l.expireAt) > now)) {
          return this.addError('LimitUpdateLockedErrorType', 'One or more limits cannot be reset until their expiry period has passed')
        }
      } else {
        if (limits.some(l => l.expireAt && new Date(l.expireAt) > now)) {
          return this.addError('LimitUpdateLockedErrorType', 'One or more limits cannot be updated until their expiry period has passed')
        }
      }
      const expireAt = reset ? null : new Date(now.getTime() + 24 * 60 * 60 * 1000)
      for (const limit of limits) {
        if (reset) {
          limit.value = ''
          limit.expireAt = null
        } else {
          if (limit.key === USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.DAILY_LOSS_LIMIT) limit.value = daily
          if (limit.key === USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.WEEKLY_LOSS_LIMIT) limit.value = weekly
          if (limit.key === USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.MONTHLY_LOSS_LIMIT) limit.value = monthly
          limit.expireAt = expireAt
        }
        await limit.save({ transaction })
      }
      return { success: true, updated: reset ? 'reset' : { daily, weekly, monthly } }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
