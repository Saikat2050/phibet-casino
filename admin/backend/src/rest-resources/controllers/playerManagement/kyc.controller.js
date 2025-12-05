import { decorateResponse } from '@src/helpers/response.helpers'
import { VerifyEmailService } from '@src/services/playerManagement/kyc/verifyEmail.service'
import { VerifyKycService } from '@src/services/playerManagement/kyc/verifyKyc.service'
import { VerifyPhoneService } from '@src/services/playerManagement/kyc/verifyPhone.service'

export class KycController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async verifyEmail (req, res, next) {
    try {
      const result = await VerifyEmailService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async verifyPhone (req, res, next) {
    try {
      const result = await VerifyPhoneService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async verifyKyc (req, res, next) {
    try {
      const result = await VerifyKycService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
