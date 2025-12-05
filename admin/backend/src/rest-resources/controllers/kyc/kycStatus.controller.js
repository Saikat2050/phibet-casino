import { decorateResponse } from '@src/helpers/response.helpers'
import { UpdateKycStatusService } from '@src/services/kyc/updateKycStatus.service'

export class KycStatusController {
  /**
   * Update user KYC status
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async updateKycStatus (req, res, next) {
    try {
      const result = await UpdateKycStatusService.execute({ 
        ...req.body, 
        adminUserId: req.authenticated.adminUserId 
      }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
} 