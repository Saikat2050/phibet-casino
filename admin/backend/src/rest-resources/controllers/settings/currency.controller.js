import { decorateResponse } from '@src/helpers/response.helpers'
import { GetCurrenciesService } from '@src/services/currency/getCurrencies.service'

export class CurrencyController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getCurrencies (req, res, next) {
    try {
      const result = await GetCurrenciesService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
