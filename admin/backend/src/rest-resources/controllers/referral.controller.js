import { decorateResponse } from '@src/helpers/response.helpers'
import { ReferralUpdateService } from '@src/services/bonus/referral/referralUpdate.service'
import { GetReferralTransactionsService } from '@src/services/bonus/referral/getReferralTransaction.service'
import { GetReferralUserDetails } from '@src/services/bonus/referral/getReferralUserDetails.service'

export class ReferralController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async referralUpdate (req, res, next) {
    try {
      const result = await ReferralUpdateService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getReferralTransactions (req, res, next) {
    try {
      const result = await GetReferralTransactionsService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getReferralUserDetails (req, res, next) {
    try {
      const result = await GetReferralUserDetails.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
