
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' }
  },
  required: ['id']
})

export class DeleteTestimonialService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { testimonial: TestimonialModel } = this.context.sequelize.models

    try {
      const testimonial = await TestimonialModel.findOne({ where: { id: this.args.id }, transaction })
      if (!testimonial) return this.addError('TestimonialNotFoundErrorType')

      await testimonial.destroy({ transaction })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
