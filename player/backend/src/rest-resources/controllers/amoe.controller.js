import { decorateResponse } from '@src/helpers/response.helpers'
import { GeneratePostalCodeService } from '@src/services/amoe/generatePostalCode.service'
import { GetAmoEntryRequestService } from '@src/services/amoe/getAmoEntryRequest.service'
import { getIp } from '@src/utils'

export class AmoeController {
  /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
  static async generatePostalCode (req, res, next) {
    try {
      const result = await GeneratePostalCodeService.execute({ ...req.query, userId: req.authenticated.userId, ipAddress: getIp(req) }, req.context)
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
  static async getAllEmoEntry (req, res, next) {
    try {
      const result = await GetAmoEntryRequestService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
