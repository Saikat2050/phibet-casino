import { decorateResponse } from '@src/helpers/response.helpers'
import { GetSpinWheelService } from '@src/services/spinWheel/getWheelDivisionConfig.service'
import { UpdateSpinWheelService } from '@src/services/spinWheel/updateWheelDivision.service'

export class WheelDivisionConfigController {
  /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
  static async getSpinWheelConfig (req, res, next) {
    try {
      const result = await GetSpinWheelService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
  static async updateSpinWheelConfig (req, res, next) {
    try {
      const result = await UpdateSpinWheelService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
