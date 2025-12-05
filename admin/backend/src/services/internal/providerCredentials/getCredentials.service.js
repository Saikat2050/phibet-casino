import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    searchString: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 1, maximum: 500, default: 10 },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'tag'], default: 'id' }
  }
})

export class GetCredentialsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage
    const searchString = this.args.searchString

    try {
      const where = {}
      if (searchString) where.name = { [Op.iLike]: `%${searchString}%` }

      const providerCredentials = await this.context.sequelize.models.providerCredentials.findAndCountAll({
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [[this.args.orderBy, this.args.order]]
      })

      return { providerCredentials: providerCredentials.rows, page, totalPages: Math.ceil(providerCredentials.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
