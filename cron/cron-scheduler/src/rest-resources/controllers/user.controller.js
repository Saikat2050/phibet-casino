import { decorateResponse } from '@src/helpers/response.helpers'
import { CheckLimitsJobService } from '@src/services/user/checkLimitsJob.service'

export default class UserController {
  static async addJobToQueue (req, res, next) {
    try {
      const { result, success, errors } = await CheckLimitsJobService.execute({ ...req.body, ...req.query }, req.context)
      decorateResponse({ req, res, next }, { result, success, errors })
    } catch (error) {
      next(error)
    }
  }
}
