import { decorateResponse } from '@src/helpers/response.helpers'
import { GetJackpotDetailService } from '@src/services/jackpot/getJackpotDetail.service'
import { UpdateJackpotPreferenceService } from '@src/services/jackpot/updateJackpotPreference.service'

export class jackpotController {
  /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
  static async getJackpotDetail (req, res, next) {
    try {
      const result = await GetJackpotDetailService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
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
  static async updateJackpotPreference (req, res, next) {
    try {
      const result = await UpdateJackpotPreferenceService.execute({ ...req.query, user: req.authenticated.userId, ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
