import { decorateScaleoResponse } from '@src/helpers/scaleoResponse.helper'
import { ScaleoEventWebhookService } from '@src/services/affiliates/scaleoEventWebhook.service'

export class AffiliateController {
  /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
  static async scaleoEventWebhook (req, res, next) {
    try {
      const result = await ScaleoEventWebhookService.execute(req.query, req.context)
      decorateScaleoResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
