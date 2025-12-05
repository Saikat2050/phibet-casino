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

export class GetTestimonialService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { testimonial: TestimonialModel } = this.context.sequelize.models

    try {
      const testimonial = await TestimonialModel.findByPk(this.args.id)
      if (!testimonial) return this.addError('TestimonialNotFoundErrorType')

      return { data: testimonial }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
