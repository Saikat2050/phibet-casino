import { decorateResponse } from '@src/helpers/response.helpers'
import GetKycStatusService from '@src/services/kyc/getKycStatus.service'
import GetKycActivityLogsService from '@src/services/kyc/getKycActivityLogs.service'
import RequestKycVerificationService from '@src/services/kyc/requestKycVerification.service'

export default class KycStatusController {
  static async getKycStatus (req, res, next) {
    try {
      const result = await GetKycStatusService.execute({
        userId: req.authenticated.userId
      }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }



  static async requestVerification (req, res, next) {

    try {
      const result = await RequestKycVerificationService.execute({
        userId: req.authenticated.userId
      }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      await transaction.rollback()
      next(error)
    }
  }

    // static async getActivityLogs (req, res, next) {
  //   try {
  //     const result = await GetKycActivityLogsService.execute({
  //       userId: req.authenticated.userId,
  //       page: parseInt(req.query.page) || 1,
  //       limit: parseInt(req.query.limit) || 20,
  //       action: req.query.action
  //     }, req.context)
  //     decorateResponse({ req, res, next }, result)
  //   } catch (error) {
  //     next(error)
  //   }
  // }
}
