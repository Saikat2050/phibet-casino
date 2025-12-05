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
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'uniqueId', 'name', 'isActive'], default: 'id' }
  }
})

export class GetAggregatorsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage
    const isActive = this.args.isActive
    const searchString = this.args.searchString

    try {
      const where = {}
      if (isActive) where.isActive = isActive
      if (searchString) where[`name.${this.context.locale}`] = { [Op.iLike]: `%${searchString}%` }

      const aggregators = await this.context.sequelize.models.casinoAggregator.findAndCountAll({
        attributes: { exclude: ['updatedAt', 'createdAt'] },
        where,
        ...((page && perPage) ? { limit: perPage, offset: (page - 1) * perPage } : {}),
        order: [[this.args.orderBy, this.args.order]]
      })

      return { aggregators: aggregators.rows, page, totalPages: Math.ceil(aggregators.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
