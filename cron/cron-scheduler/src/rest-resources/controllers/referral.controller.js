import { decorateResponse } from '@src/helpers/response.helpers'
import { AddDepositReferralJobService } from '@src/services/vipSystem/addReferralDepositJob.service'

export default class ReferralController {
  static async addJobToQueue (req, res, next) {
    try {
      const { result, success, errors } = await AddDepositReferralJobService.execute({ ...req.body, ...req.query }, req.context)
      decorateResponse({ req, res, next }, { result, success, errors })
    } catch (error) {
      next(error)
    }
  }
}
