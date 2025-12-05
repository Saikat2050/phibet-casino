import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500 },
    isActive: { type: 'boolean' },
    searchString: { type: 'string' },
    aggregatorId: { type: 'string' },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'uniqueId', 'name', 'aggregatorId', 'isActive', 'orderId'], default: 'orderId' }
  }
})

export class GetProvidersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage
    const isActive = this.args.isActive
    const searchString = this.args.searchString
    const casinoAggregatorId = this.args.aggregatorId
    const orderBy = this.args.orderBy
    const order = this.args.order

    try {
      const where = {}
      if (isActive) where.isActive = isActive
      if (searchString) where[`name.${this.context.locale}`] = { [Op.iLike]: `%${searchString}%` }
      if (casinoAggregatorId) where.casinoAggregatorId = casinoAggregatorId

      const providers = await this.context.sequelize.models.casinoProvider.findAndCountAll({
        attributes: { exclude: ['updatedAt', 'createdAt'] },
        where,
        include: {
          model: this.context.sequelize.models.casinoAggregator,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        },
        ...((page && perPage) ? { limit: perPage, offset: (page - 1) * perPage } : {}),
        raw: true,
        nest: true,
        order: [[orderBy, order]]
      })

      return { providers: providers.rows, page, totalPages: Math.ceil(providers.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
