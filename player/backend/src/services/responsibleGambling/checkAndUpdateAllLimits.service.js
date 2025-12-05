import ajv from '@src/libs/ajv'
import axios from 'axios'
import ServiceBase from '@src/libs/serviceBase'
import { appConfig } from '@src/configs'
import { Logger } from '@src/libs/logger'
import { SELF_EXCLUSION_TYPES } from '@src/utils/constants/public.constants.utils'
import { dayjs } from '@src/libs/dayjs'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    limit: { type: 'object' },
    isActive: { type: 'boolean' },
    userId: { type: 'string' },
    activity: { type: 'boolean', default: false }
  },
  required: ['userId']
})

export class CheckAndUpdateAllLimits extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { limit, isActive, userId, activity } = this.args
    try {
      if (!limit) {
        limit = await this.context.sequelize.models.userLimit.findOne({ where: { userId }, attributes: ['key', 'value', 'expireAt', 'id'] })
        if (limit.value === SELF_EXCLUSION_TYPES.PERMANENT) return this.addError('ExcludedPermanentlyPleaseContactProviderErrorType')
        if (limit.value === SELF_EXCLUSION_TYPES.TEMPORARY && !dayjs().isAfter(limit.expireAt)) return this.addError('SelfExcludedErrorType')

        const userDetails = await this.context.sequelize.models.user.findByPk(userId, { attributes: ['id', 'isActive'] })
        isActive = userDetails.isActive
      }

      const { statusText } = await axios({
        url: `${appConfig.jobScheduler.jobSchedulerUrl}/user/limits`,
        method: 'POST',
        headers: { Authorization: `Basic ${Buffer.from(`${appConfig.jobScheduler.jobSchedulerUsername}:${appConfig.jobScheduler.jobSchedulerPassword}`).toString('base64')}` },
        data: { userId, limit, isActive, activity }
      })
      if (statusText === 'OK') Logger.info('Limits and Activity Logs updated.')
      else Logger.error(`Error in Upgrading Limits and Activity Logs of Player - ${statusText}`)

      return { success: true }
    } catch (error) {
      Logger.error(`Error in Upgrading Limits and Activity Logs of Player - ${error}`)
    }
  }
}
