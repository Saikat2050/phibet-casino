import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import _ from 'lodash'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    isActive: { type: 'boolean' },
    searchString: { type: 'string' },
    page: { type: 'number', minimum: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500 },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'slug', 'isActive'], default: 'id' }
  }
})

export class GetPagesService extends ServiceBase {
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
      if (_.isBoolean(isActive)) where.isActive = isActive
      if (searchString) {
        where[Op.or] = [
          { slug: { [Op.iLike]: `%${searchString}%` } },
          { [`title.${this.context.locale}`]: { [Op.iLike]: `%${searchString}%` } }
        ]
      }

      const pages = await this.context.sequelize.models.page.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        ...(page && perPage ? { limit: perPage, offset: (page - 1) * perPage } : {}),
        order: [[this.args.orderBy, this.args.order]]
      })
      return { pages: pages.rows, page, totalPages: Math.ceil(pages.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
