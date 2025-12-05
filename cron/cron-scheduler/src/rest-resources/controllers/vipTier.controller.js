import { decorateResponse } from '@src/helpers/response.helpers'
import { AddTierUpgradeJobService } from '@src/services/vipSystem/addTierUpgradeJob.service'

export default class VipTierController {
  static async addJobToQueue (req, res, next) {
    try {
      const { result, success, errors } = await AddTierUpgradeJobService.execute({ ...req.body, ...req.query }, req.context)
      decorateResponse({ req, res, next }, { result, success, errors })
    } catch (error) {
      next(error)
    }
  }
}
