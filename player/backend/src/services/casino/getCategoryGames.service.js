import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { GetIpLocationService } from '@src/services/common/getIpLocation.service'
import { Op, Sequelize, literal } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    page: { type: 'number', default: 1, minimum: 1 },
    perPage: { type: 'number', default: 10 },
    search: { type: 'string' },
    deviceType: { type: 'string', enum: ['Desktop', 'Mobile', null, ''] },
    categories: { type: 'string', default: '[]' },
    rating: { type: 'string', default: '[]' },
    providers: { type: 'string', default: '[]' },
    ipAddress: { type: 'string' }
  }
})

export class GetCategoryGamesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const search = this.args.search
    const limit = this.args.perPage
    const page = this.args.page
    const userId = this.args.userId
    const providers = JSON.parse(this.args.providers)
    const deviceType = this.args.deviceType

    try {
      const { result: { state } } = await GetIpLocationService.execute({ ipAddress: this.args.ipAddress }, this.context)

      const where = { isActive: true }

      if (search) where.name = { EN: { [Op.iLike]: `%${search}%` } }
      if (deviceType) where.devices = { [Op.contains]: [deviceType] }
      if (providers.length) where.casinoProviderId = { [Op.in]: providers }

      const { rows, count } = await this.context.sequelize.models.casinoCategory.findAndCountAll({
        order: [['orderId', 'ASC']],
        where: { isActive: true },
        include: {
          model: this.context.sequelize.models.casinoGameCategory,
          include: {
            model: this.context.sequelize.models.casinoGame,
            attributes: [
              'id',
              'name',
              'mobileImageUrl',
              'desktopImageUrl',
              'casinoCategoryId',
              'casinoProviderId',
              'returnToPlayer',
              'uniqueId',
              'demoAvailable',
              'devices',
              'restrictedStates',
              'thumbnailUrl',
              [userId ? Sequelize.literal(`(CASE WHEN EXISTS(SELECT id FROM favorite_games WHERE user_id=${userId} AND casino_game_id="casinoGameCategories->casinoGame"."id") THEN true ELSE false END)`) : Sequelize.literal('false'), 'isFavorite']
            ],
            include: {
              model: this.context.sequelize.models.casinoProvider,
              where: { isActive: true },
              attributes: [],
              required: true,
              include: {
                attributes: [],
                model: this.context.sequelize.models.casinoAggregator,
                where: { isActive: true },
                required: true
              }
            },
            required: true,
            where: {
              ...where,
              [Op.not]: literal(`
           not EXISTS (
               SELECT 1
               FROM jsonb_array_elements_text("restricted_states") AS value
               WHERE value::int = ${state?.id || 0}
           )
              `)
            }
          }

        },
        limit,
        offset: (page - 1) * limit
      })
      return { casinoGames: rows, totalPages: Math.ceil(count / limit), page, count }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
