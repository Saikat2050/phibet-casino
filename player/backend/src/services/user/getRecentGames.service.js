import { APIError } from '@src/errors/api.error'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'

const schema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 5, maximum: 500, default: 7 }
  },
  required: ['userId']
}

const constraints = ajv.compile(schema)

export class GetRecentGamesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, perPage, page } = this.args
    try {
      const queryObject = `select distinct ON (ct.game_id)
      ct.game_id,
      cg.name AS "gameName", cg.unique_id AS "uniqueId", cg.thumbnail_url as "thumbnailUrl", cg.mobile_image_url as "mobileImageUrl", cg.desktop_image_url as "desktopImageUrl",
      cp.id AS "providerId", cp.name AS "providerName", cp.icon_url AS "providerIcon",
      csc.id AS "categoryId", csc.name AS "categoryName", csc.icon_url AS "categoryIcon"
      from casino_transactions as ct
      join casino_games as cg on cg.id = ct.game_id AND cg.is_active = true
      join casino_providers as cp on cp.id = cg.casino_provider_id AND cp.is_active = true
      join casino_aggregators as ca on ca.id = cp.casino_aggregator_id AND ca.is_active = true
      join casino_categories as csc on csc.id = cg.casino_category_id
      where user_id = ${userId}`

      const orderByClause = 'ORDER BY ct.game_id, ct.created_at DESC'
      const limitClause = `LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`
      const queryString = `${queryObject} ${orderByClause} ${limitClause};`

      const recentGameData = await this.context.sequelize.query(queryString, { type: this.context.sequelize.QueryTypes.SELECT })
      const data = recentGameData || []

      return { data }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
