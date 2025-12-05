import { decorateResponse } from '@src/helpers/response.helpers'
import { GetPaysafeBanksService } from '@src/services/payment/paysafe/playerBankDetails.service'
import { PaysafeDepositAmountService } from '@src/services/payment/paysafe/depositAmount.service'
import { PaysafeDepositWebhookService } from '@src/services/payment/paysafe/paysafeDepositCallback.service'
import { PaysafeBankRegistrationService } from '@src/services/payment/paysafe/accountRegistration.service'

export class PaysafePaymentController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async paysafeDepositAmount (req, res, next) {
    try {
      const result = await PaysafeDepositAmountService.execute({ userId: req.authenticated.userId, ...req.body }, req.context)
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
  static async paysafeBankRegistration (req, res, next) {
    try {
      const result = await PaysafeBankRegistrationService.execute({ userId: req.authenticated.userId, ...req.body }, req.context)
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
  static async paysafeWebhook (req, res, next) {
    try {
      const result = await PaysafeDepositWebhookService.execute({ ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async bankDetails (req, res, next) {
    try {
      const result = await GetPaysafeBanksService.execute({ ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
