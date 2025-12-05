import { decorateResponse } from '@src/helpers/response.helpers'
import { CreateTestimonialService } from '@src/services/testimonial/createTestimonial.service'
import { DeleteTestimonialService } from '@src/services/testimonial/deleteTestimonial.service'
import { GetTestimonialService } from '@src/services/testimonial/getTestimonial.service'
import { GetTestimonialsService } from '@src/services/testimonial/getTestimonials.service'
import { UpdateTestimonialService } from '@src/services/testimonial/updateTestimonial.service'

export class TestimonialController {
  static async getTestimonial (req, res, next) {
    try {
      const result = await GetTestimonialService.execute({ ...req.query }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getTestimonials (req, res, next) {
    try {
      const result = await GetTestimonialsService.execute({ ...req.query }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async createTestimonial (req, res, next) {
    try {
      const result = await CreateTestimonialService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async updateTestimonial (req, res, next) {
    try {
      const result = await UpdateTestimonialService.execute({ ...req.body, ...req.query }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async deleteTestimonial (req, res, next) {
    try {
      const result = await DeleteTestimonialService.execute({ ...req.query, ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
