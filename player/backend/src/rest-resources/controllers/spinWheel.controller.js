import { decorateResponse } from '@src/helpers/response.helpers'
import { GenerateSpinService } from '@src/services/spinWheel/generateSpin.service'
import { GetSpinWheelListService } from '@src/services/spinWheel/getSpinWheelList.service'

export class SpinWheelController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getSpinWheelList (req, res, next) {
    try {
      const result = await GetSpinWheelListService.execute({}, req.context)
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
  static async generateSpinWheelIndex (req, res, next) {
    try {
      const result = await GenerateSpinService.execute({ userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
