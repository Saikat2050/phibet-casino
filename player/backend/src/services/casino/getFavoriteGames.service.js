import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { GetIpLocationService } from '@src/services/common/getIpLocation.service'
import { Op, literal } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    pageNo: { type: 'number', minimum: 1, default: 1 },
    limit: { type: 'number', minimum: 10, default: 10 },
    name: { type: 'string' },
    categories: { type: 'string', default: '[]' },
    rating: { type: 'string', default: '[]' },
    providers: { type: 'string', default: '[]' },
    search: { type: 'string' },
    deviceType: { type: 'string', enum: ['Desktop', 'Mobile', null, ''] },
    ipAddress: { type: 'string' },
    volatilityRating: { type: 'string' }
  },
  required: ['userId', 'ipAddress']
})

export class GetFavoriteGamesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const name = this.args.name
    const limit = this.args.limit
    const userId = this.args.userId
    const rating = JSON.parse(this.args.rating)
    const pageNo = this.args.pageNo
    const providers = JSON.parse(this.args.providers)
    const deviceType = this.args.deviceType
    const categories = JSON.parse(this.args.categories)
    const volatilityRating = this.args.volatilityRating

    try {
      const { result: { state } } = await GetIpLocationService.execute({ ipAddress: this.args.ipAddress }, this.context)

      const where = { isActive: true }
      const categoryWhere = { isActive: true }

      let casinoGamecategory = {}
      if (name) where.name = { EN: { [Op.iLike]: `%${name}%` } }
      if (deviceType) where.devices = { [Op.contains]: [deviceType] }
      if (rating?.length) where.volatilityRating = { [Op.in]: rating }
      if (providers.length) where.casinoProviderId = { [Op.in]: providers }
      if (volatilityRating) where.volatilityRating = volatilityRating
      if (categories.length) categoryWhere.id = { [Op.in]: categories }

      casinoGamecategory = {
        attributes: ['id', 'name', 'iconUrl', 'slug'],
        model: this.context.sequelize.models.casinoCategory,
        where: categoryWhere,
        required: true
      }

      const favoriteGames = await this.context.sequelize.models.favoriteGame.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { userId },
        include: [{
          attributes: ['id', 'name', 'mobileImageUrl', 'desktopImageUrl', 'casinoCategoryId', 'casinoProviderId', 'returnToPlayer', 'uniqueId', 'demoAvailable', 'devices', 'restrictedStates', 'thumbnailUrl'],
          model: this.context.sequelize.models.casinoGame,
          required: true,
          where: {
            isActive: true,
            ...where,
            // restrictedStates: { [Op.not]: { [Op.contains]: [state?.id] } },
            [Op.not]: literal(`
              NOT EXISTS (
                SELECT 1
                FROM jsonb_array_elements_text("casinoGame"."restricted_states") AS value
                WHERE value::int = ${state?.id || 0}
              )
            `)
          },
          include: [{
            attributes: ['name'],
            model: this.context.sequelize.models.casinoProvider,
            required: true,
            where: {
              isActive: true,
              // restrictedStates: { [Op.not]: { [Op.contains]: [state?.id] } },
              [Op.not]: literal(`
                NOT EXISTS (
                  SELECT 1
                  FROM jsonb_array_elements_text("casinoGame->casinoProvider"."restricted_states") AS value
                  WHERE value::int = ${state?.id || 0}
                )
              `)
            },
            include: {
              attributes: [],
              model: this.context.sequelize.models.casinoAggregator,
              where: { isActive: true },
              required: true
            }
          }, casinoGamecategory]
        }],
        limit,
        offset: (pageNo - 1) * limit
      })

      return { favoriteGames }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
