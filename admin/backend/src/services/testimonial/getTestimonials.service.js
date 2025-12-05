import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { isBoolean } from 'lodash'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    order: { type: 'string', default: 'DESC' },
    orderBy: { type: 'string', default: 'updatedAt' },
    page: { type: 'string', default: 1, min: 1 },
    limit: { type: 'string', default: 10, min: 10 },
    isActive: { type: 'boolean' },
    searchString: { type: 'string' }
  }
})

export class GetTestimonialsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { limit, page, orderBy, order, isActive, searchString } = this.args

    try {
      const where = {}
      if (isBoolean(isActive)) where.isActive = isActive
      if (searchString) where.author = { [Op.iLike]: `%${searchString}%` }

      const testimonials = await this.context.sequelize.models.testimonial.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        order: [[orderBy, order]],
        limit,
        offset: limit * (page - 1)
      })

      return { data: testimonials, totalpages: Math.ceil(testimonials?.count / limit) || 1, page }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
