import { decorateResponse } from '@src/helpers/response.helpers'
import { AddJackpotEntryJobService } from '@src/services/jackpot/addJackpotEntryJob.service'

export default class JackpotController {
  static async addJobToQueue (req, res, next) {
    try {
      const { result, success, errors } = await AddJackpotEntryJobService.execute({ ...req.body, ...req.query }, req.context)
      decorateResponse({ req, res, next }, { result, success, errors })
    } catch (error) {
      next(error)
    }
  }
}
