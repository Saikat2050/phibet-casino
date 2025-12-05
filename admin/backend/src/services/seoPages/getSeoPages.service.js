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
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 }
  }
})

export class GetSeoPagesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { isActive, searchString, page, perPage } = this.args

    try {
      const where = {}
      if (_.isBoolean(isActive)) where.isActive = isActive
      if (searchString) {
        where[Op.or] = [
          { slug: { [Op.iLike]: `%${searchString}%` } },
          { title: { [Op.iLike]: `%${searchString}%` } },
          { description: { [Op.iLike]: `%${searchString}%` } }
        ]
      }

      const seoPages = await this.context.sequelize.models.seoPages.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [['createdAt', 'DESC']]
      })
      return { pages: seoPages.rows, page, totalPages: Math.ceil(seoPages.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
