import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: ['number', 'string'] }
  }
})
export class GetVipTiersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userId = this.args.userId
    let userDetails, userActiveVipTier

    try {
      const user = await this.context.sequelize.models.user.findOne({
        where: { id: userId },
        attributes: ['uniqueId']
      })
      if (!user) return

      userDetails = await Cache.get(`${user.uniqueId}_details`)
      if (!userDetails?.activeTier || (userDetails.activeTier && !Object.keys(userDetails.activeTier)?.length)) {
        userDetails = await this.context.sequelize.models.userVipTier.findOne({
          where: { isActive: true, userId },
          attributes: ['id'],
          include: {
            model: this.context.sequelize.models.vipTier,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            required: true
          }
        })

        userActiveVipTier = userDetails?.vipTier
        await Cache.set(`${userDetails.uniqueId}_details`, {
          activeTier: userDetails.vipTier
        })
      } else userActiveVipTier = userDetails?.activeTier
      if (!userActiveVipTier) return

      const vipTiers = await Cache.get(CACHE_KEYS.VIP_TIER)

      const currentLevelIndex = vipTiers.findIndex(obj => obj.id === userActiveVipTier.id)
      const nextVipTierDetails = vipTiers.slice(currentLevelIndex + 1)

      const allVipTiers = vipTiers
      return { userActiveVipTier, nextVipTierDetails, allVipTiers }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
