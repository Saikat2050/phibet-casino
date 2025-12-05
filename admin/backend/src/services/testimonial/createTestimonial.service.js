import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    author: { type: 'string' },
    content: { type: 'string' },
    isActive: { type: 'boolean' },
    rating: { type: 'number' }
  },
  required: ['author', 'content', 'isActive', 'rating']
})

export class CreateTestimonialService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { author, content, isActive, rating } = this.args
    const transaction = this.context.sequelizeTransaction
    const { testimonial: TestimonialModel } = this.context.sequelize.models

    try {
      const isExist = await TestimonialModel.findOne({ where: { author } })
      if (isExist) return this.addError('TestimonialAuthorAlreadyExistErrorType')

      const testimonial = await TestimonialModel.create(
        { author, content, isActive, rating },
        { transaction, returning: true }
      )

      return { testimonial, success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
