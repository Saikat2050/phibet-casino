import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'

export class GetTestimonialsService extends ServiceBase {
  async run () {
    try {
      const testimonials = await this.context.sequelize.models.testimonial.findAll({
        where: { isActive: true },
        order: [['createdAt', 'DESC']]
      })

      return { testimonials }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
