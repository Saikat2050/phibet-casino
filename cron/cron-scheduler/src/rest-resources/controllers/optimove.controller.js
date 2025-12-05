import { decorateResponse } from '@src/helpers/response.helpers'
import { CreateOptimoveJobService } from '@src/services/optimove/createOptimoveJob.service'

export default class OptimoveController {
  static async createOptimoveJobs (req, res, next) {
    try {
      const { result, success, errors } = await CreateOptimoveJobService.execute({ ...req.body, ...req.query }, req.context)
      decorateResponse({ req, res, next }, { result, success, errors })
    } catch (error) {
      next(error)
    }
  }
}
