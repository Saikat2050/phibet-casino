import { decorateResponse } from '@src/helpers/response.helpers'
import { CreateWithdrawlRequestJobService } from '@src/services/internal/createWithdrawlRequestJob.service'
import { AleaGamesSeedingJobService } from '@src/services/internal/aleaGamesSeedingJob.service'
import { Iconic21GamesSeedingJobService } from '@src/services/internal/iconic21GamesSeedingJob.service'

export class InternalController {
  /**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
  static async addWithdrawlRequestJobs (req, res, next) {
    try {
      const result = await CreateWithdrawlRequestJobService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async addAleaGameSeedingJobs (req, res, next) {
    try {
      const result = await AleaGamesSeedingJobService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async addIconic21GameSeedingJobs (req, res, next) {
    try {
      const result = await Iconic21GamesSeedingJobService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
