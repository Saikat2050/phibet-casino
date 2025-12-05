import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500 },
    isActive: { type: 'boolean' },
    isSidebar: { type: 'boolean' },
    isLobbyPage: { type: 'boolean' },
    searchString: { type: 'string' },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'uniqueId', 'name', 'isActive', 'orderId', 'createdAt', 'isSidebar', 'isLobbyPage'], default: 'orderId' }
  }
})

export class GetCategoriesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage
    const isActive = this.args.isActive
    const isSidebar = this.args.isSidebar
    const isLobbyPage = this.args.isLobbyPage
    const searchString = this.args.searchString

    try {
      const where = {}
      if (_.isBoolean(isActive)) where.isActive = isActive
      if (_.isBoolean(isSidebar)) where.isSidebar = isSidebar
      if (_.isBoolean(isLobbyPage)) where.isLobbyPage = isLobbyPage
      if (searchString) where[`name.${this.context.locale}`] = { [Op.iLike]: `%${searchString}%` }

      const categories = await this.context.sequelize.models.casinoCategory.findAndCountAll({
        attributes: { exclude: ['updatedAt', 'createdAt'] },
        where,
        ...((page && perPage) ? { limit: perPage, offset: (page - 1) * perPage } : {}),
        order: [[this.args.orderBy, this.args.order]]
      })

      return { categories: categories.rows, page, totalPages: Math.ceil(categories.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
