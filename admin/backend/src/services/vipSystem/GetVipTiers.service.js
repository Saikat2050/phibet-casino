import { APIError } from '@src/errors/api.error'
import { Cache } from '@src/libs/cache'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { sequelize } from '@src/database/models'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 1, maximum: 500 }
  }
})

export class GetVipTiersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const page = this.args.page
      const perPage = this.args.perPage
      let vipTiers = await Cache.get(CACHE_KEYS.ALL_VIP_TIERS)
      if (!vipTiers?.length) {
        vipTiers = await sequelize.models.vipTier.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, order: [['id', 'ASC']], raw: true })
        await Cache.set(CACHE_KEYS.ALL_VIP_TIERS, vipTiers)
      }

      const startIndex = (page - 1) * perPage
      const endIndex = page * perPage

      const paginatedVipTiers = vipTiers.slice(startIndex, endIndex)

      return {
        vipTiers: paginatedVipTiers,
        totalPages: Math.ceil(vipTiers.length / perPage),
        count: vipTiers.length
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
