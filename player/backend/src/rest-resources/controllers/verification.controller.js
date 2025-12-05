import { decorateResponse } from '@src/helpers/response.helpers'
import { InitKycService } from '@src/services/verification/kyc/initKyc.service'
import { ForgotPasswordService } from '@src/services/user/forgotPassword.service'
import { ResendEmailService } from '@src/services/verification/email/resendEmail.service'
import { VerifyEmailService } from '@src/services/verification/email/verifyEmail.service'
import { ResendMobileOtpService } from '@src/services/verification/phone/resendOtp.service'
import { RequestMobileOtpService } from '@src/services/verification/phone/requestOtp.service'
import { VerifyForgotPasswordService } from '@src/services/user/verifyForgotPassword.service'
import { UpdateKycStatusService } from '@src/services/verification/kyc/shuftiCallback.service'
import { VerifyMobileOtpService } from '@src/services/verification/phone/verifyOtp.service'
import { InitIdComplyService } from '@src/services/verification/kyc/initIdComply.service'

export class VerificationController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async requestOtp (req, res, next) {
    try {
      const result = await RequestMobileOtpService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
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
  static async verifyOtp (req, res, next) {
    try {
      const result = await VerifyMobileOtpService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
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
  static async resendOtp (req, res, next) {
    try {
      const result = await ResendMobileOtpService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async resendEmail (req, res, next) {
    try {
      const result = await ResendEmailService.execute({ ...req.query, userId: req?.authenticated?.userId }, req.context)
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
  static async verifyEmail (req, res, next) {
    try {
      const result = await VerifyEmailService.execute({ ...req.query }, req.context)
      // if (result.success) result.result.accessToken = await createSession(req, result.result.user.id, result.result.user.sessionLimit)
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
  static async forgotPassword (req, res, next) {
    try {
      const result = await ForgotPasswordService.execute(req.body, req.context)
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
  static async verifyForgotPassword (req, res, next) {
    try {
      const result = await VerifyForgotPasswordService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async initIDComplyKyc (req, res, next) {
    try {
      const result = await InitIdComplyService.execute({ ...req.body, userId: req?.authenticated?.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async initKyc (req, res, next) {
    try {
      const result = await InitKycService.execute({ ...req.body, userId: req?.authenticated?.userId }, req.context)
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
  static async getKycStatus (req, res, next) {
    try {
      const result = await UpdateKycStatusService.execute({ ...req.body, ...req.query }, req.context)
      if (result.success) {
        res.status(200).json({ ...result.result })
      } else {
        res.status(400).json({ ...result.errors })
      }
    } catch (error) {
      res.status(400).json({ ...error })
    }
  }
}
