import { decorateResponse } from '@src/helpers/response.helpers'
import { AddScaleoJobService } from '@src/services/scaleo/addScaleoJob.service'

export default class ScaleoController {
  static async addJobToQueue (req, res, next) {
    try {
      const { result, success, errors } = await AddScaleoJobService.execute({ ...req.body, ...req.query }, req.context)
      decorateResponse({ req, res, next }, { result, success, errors })
    } catch (error) {
      next(error)
    }
  }
}
