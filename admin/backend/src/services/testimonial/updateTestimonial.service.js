
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import { isBoolean } from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' },
    author: { type: 'string' },
    content: { type: 'string' },
    isActive: { type: 'boolean' },
    rating: { type: 'number' }
  },
  required: ['id']
})

export class UpdateTestimonialService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { id, author, content, isActive, rating } = this.args
    const transaction = this.context.sequelizeTransaction
    const { testimonial: TestimonialModel } = this.context.sequelize.models

    try {
      const testimonial = await TestimonialModel.findOne({ where: { id }, transaction })
      if (!testimonial) return this.addError('TestimonialNotFoundErrorType')

      if (author) testimonial.author = author
      if (content) testimonial.content = content
      if (isBoolean(isActive)) testimonial.isActive = isActive
      if (rating) testimonial.rating = rating

      await testimonial.save({ transaction })

      return { testimonial, success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
