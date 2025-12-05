import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { GetIpLocationService } from '@src/services/common/getIpLocation.service'
import { Op, Sequelize, literal } from 'sequelize'

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
    landingPage: { type: 'string' },
    deviceType: { type: 'string', enum: ['Desktop', 'Mobile', null, ''] },
    ipAddress: { type: 'string' },
    stateCode: { type: ['string', 'null'] },
    volatilityRating: { type: 'string' }
  }
})

export class GetAllCasinoGamesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const name = this.args.name
    const stateCode = this.args.stateCode
    const limit = this.args.limit
    const userId = this.args.userId
    const rating = JSON.parse(this.args.rating)
    const pageNo = this.args.pageNo
    const providers = JSON.parse(this.args.providers)
    const deviceType = this.args.deviceType
    const categories = JSON.parse(this.args.categories)
    const volatilityRating = this.args.volatilityRating
    const landingPage = this.args.landingPage
    let stateId

    try {
      const { result: { state } } = await GetIpLocationService.execute({ ipAddress: this.args.ipAddress }, this.context)
      if (stateCode) {
        const state = await this.context.sequelize.models.state.findOne({ where: { code: stateCode, isActive: true }, attributes: ['id'], raw: true })
        stateId = state?.id
      }

      let order = [['isFeatured', 'DESC'], ['orderId', 'ASC'], ['createdAt', 'DESC']]
      const where = { isActive: true }
      let casinoGamecategory = {}
      if (name) where.name = { EN: { [Op.iLike]: `%${name}%` } }
      if (landingPage) order = [['landingPage', 'DESC'], ['isFeatured', 'DESC'], ['orderId', 'ASC'], ['createdAt', 'DESC']]
      if (deviceType) where.devices = { [Op.contains]: [deviceType] }
      if (rating?.length) where.volatilityRating = { [Op.in]: rating }
      if (providers.length) where.casinoProviderId = { [Op.in]: providers }
      if (volatilityRating) where.volatilityRating = volatilityRating
      if (categories.length) {
        casinoGamecategory = {
          attributes: ['id', 'casinoCategoryId', 'casinoGameId'],
          model: this.context.sequelize.models.casinoGameCategory,
          where: { casinoCategoryId: { [Op.in]: categories } },
          include: [{
            attributes: ['id', 'name', 'iconUrl', 'slug'],
            model: this.context.sequelize.models.casinoCategory,
            where: {
              isActive: true
            },
            required: true
          }],
          required: true
        }
      } else {
        casinoGamecategory = {
          attributes: ['id', 'name', 'iconUrl', 'slug'],
          model: this.context.sequelize.models.casinoCategory,
          where: {
            isActive: true
          },
          required: true
        }
      }

      const casinoGames = await this.context.sequelize.models.casinoGame.findAndCountAll({
        subQuery: false,
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
          'volatilityRating',
          [userId ? Sequelize.literal(`(CASE WHEN EXISTS(SELECT id FROM favorite_games WHERE user_id=${userId} AND casino_game_id="casinoGame"."id") THEN true ELSE false END)`) : Sequelize.literal('false'), 'isFavorite']
        ],
        where: {
          ...where,
          // restrictedStates: { [Op.not]: { [Op.contains]: [stateId, state?.id] } }
          [Op.not]: literal(`
                      NOT EXISTS (
                        SELECT 1
                        FROM jsonb_array_elements_text("casinoGame"."restricted_states") AS value
                        WHERE value::int = ${stateId || state?.id || 0}
                      )
                    `)
        },
        include: [{
          attributes: ['id', 'name', 'iconUrl'],
          model: this.context.sequelize.models.casinoProvider,
          where: {
            isActive: true,
            // restrictedStates: { [Op.not]: { [Op.contains]: [stateId, state?.id] } }
            [Op.not]: literal(`
                      NOT EXISTS (
                        SELECT 1
                        FROM jsonb_array_elements_text("casinoProvider"."restricted_states") AS value
                        WHERE value::int = ${stateId || state?.id || 0}
                      )
                    `)
          },
          include: {
            attributes: ['id'],
            model: this.context.sequelize.models.casinoAggregator,
            where: { isActive: true },
            required: true
          },
          required: true
        }, casinoGamecategory],
        order,
        limit,
        offset: (pageNo - 1) * limit,
        logging: false
      })

      return { casinoGames }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
