import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    searchString: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['id', 'tag', 'createdAt'], default: 'createdAt' }
  }
})

export class GetTagsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage
    const searchString = this.args.searchString

    try {
      const where = {}
      if (searchString) where.tag = { [Op.iLike]: `%${searchString}%` }

      const tags = await this.context.sequelize.models.tag.findAndCountAll({
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [[this.args.orderBy, this.args.order]]
      })

      return { tags: tags.rows, page, totalPages: Math.ceil(tags.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
