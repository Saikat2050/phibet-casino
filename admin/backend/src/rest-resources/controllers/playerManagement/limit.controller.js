import { decorateResponse } from '@src/helpers/response.helpers'
import { UpdateSelfExclusionService } from '@src/services/playerManagement/limits/updateSelfExclusion.service'
import { UpdateLossLimitService } from '@src/services/playerManagement/limits/updateLossLimit.service'
import { UpdateDepositLimitService } from '@src/services/playerManagement/limits/updateDepositLimit.service'
import { UpdateBetLimitService } from '@src/services/playerManagement/limits/updateBetLimit.service'

export class LimitController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async updateSelfExclusion (req, res, next) {
    try {
      const result = await UpdateSelfExclusionService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async updateLossLimit (req, res, next) {
    try {
      const result = await UpdateLossLimitService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async updateDepositLimit (req, res, next) {
    try {
      const result = await UpdateDepositLimitService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async updateBetLimit (req, res, next) {
    try {
      const result = await UpdateBetLimitService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
