import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import axios from 'axios'
import ServiceBase from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { appConfig } from '@src/configs'
import { Cache } from '@src/libs/cache'
import { Logger } from '@src/libs/logger'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userDetails: { type: 'object' }
  }
})
export class UserLevelUpgradeService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userDetails = this.args.userDetails
    try {
      Logger.info('In VIP level Upgrade Service')
      let userActiveVipTier = (await Cache.get(`${userDetails.uniqueId}_details`)).activeTier
      if (!userActiveVipTier || (userActiveVipTier && !Object.keys(userActiveVipTier)?.length)) {
        userActiveVipTier = await this.context.sequelize.models.userVipTier.findOne({
          attributes: ['id'],
          where: { isActive: true, userId: userDetails.id },
          include: {
            model: this.context.sequelize.models.vipTier,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            required: true
          }
        })

        await Cache.set(`${userDetails.uniqueId}_details`, {
          activeTier: userActiveVipTier.vipTier
        })
      }

      let vipTiers = await Cache.get(CACHE_KEYS.VIP_TIER)
      if (!vipTiers?.length) {
        vipTiers = await this.context.sequelize.models.vipTier.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, order: [['id', 'ASC']], raw: true })
        await Cache.set(CACHE_KEYS.VIP_TIER, vipTiers)
      }

      Logger.info(`---------------------UER VIP TIER------------------------- ${JSON.stringify(userActiveVipTier)}`)
      Logger.info(`--------------------VIP TIER-------------------------- ${JSON.stringify(vipTiers)}`)

      let currentLevelIndex = vipTiers.findIndex(obj => obj.id === userActiveVipTier.id)
      let nextVipTierDetails = vipTiers[currentLevelIndex + 1]

      if (!nextVipTierDetails || (nextVipTierDetails && !Object.keys(nextVipTierDetails)?.length)) {
        Logger.info(`No next level found for user - ${userDetails.id} whose sc waggered amount is ${userDetails.scWaggeredAmount}`)
        return
      }
      const xpRequirementsSettings = await Cache.get(CACHE_KEYS.SETTINGS)
      const userWaggeredScXp = (xpRequirementsSettings?.xpRequirements || 1) * (userDetails.scWaggeredAmount)

      while (userWaggeredScXp >= +nextVipTierDetails.xpRequirement) {
        const { statusText } = await axios({
          url: `${appConfig.jobScheduler.jobSchedulerUrl}/vip-tier`,
          method: 'POST',
          headers: { Authorization: `Basic ${Buffer.from(`${appConfig.jobScheduler.jobSchedulerUsername}:${appConfig.jobScheduler.jobSchedulerPassword}`).toString('base64')}` },
          data: {
            userId: userDetails.id,
            currentVipTier: userActiveVipTier,
            nextVipTier: nextVipTierDetails
          }
        })
        if (statusText === 'OK') {
          Logger.info('VIP Level Upgraded')
          await Cache.set(`${userDetails.uniqueId}_details`, {
            activeTier: nextVipTierDetails
          })
        } else {
          Logger.error(`Error in Upgrading VIP Tier of Player - ${statusText}`)
        }

        userActiveVipTier = nextVipTierDetails
        currentLevelIndex = currentLevelIndex + 1
        nextVipTierDetails = vipTiers[currentLevelIndex + 1]
      }
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
