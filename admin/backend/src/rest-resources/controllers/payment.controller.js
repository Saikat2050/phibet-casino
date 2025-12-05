import { StatusCodes } from 'http-status-codes'
import { validateFile } from '@src/helpers/common.helper'
import { OK } from '@src/utils/constants/public.constants.utils'
import { decorateResponse } from '@src/helpers/response.helpers'
import { CreatePaymentProviderService } from '@src/services/payment/createPaymentProvider.service'
import { GetPaymentProvidersService } from '@src/services/payment/getPaymentProviders.service'
import { GetPaymentProviderService } from '@src/services/payment/getPaymentProvidersDetails.service'
import { UpdatePaymentProviderService } from '@src/services/payment/updatePaymentProvider.service'
import { GetWithdrawalsService } from '@src/services/payment/withdrawalRequests/getWithdrawals.service'
import { GetPaymentAggregatorService } from '@src/services/payment/getPaymentAggregators.service'
import { ApproveRejectWithdrawalsService } from '@src/services/payment/approveRejectWithdrawal.service'
import { GetUserPaymentCardsService } from '@src/services/payment/getUserPaymentCards.service'

export default class PaymentProviderController {
  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async getAllPaymentProviders (req, res, next) {
    try {
      const result = await GetPaymentProvidersService.execute(req.query, req.context)
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
  static async getPaymentProvider (req, res, next) {
    try {
      const result = await GetPaymentProviderService.execute(req.query, req.context)
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
  static async getPaymentAggregator (req, res, next) {
    try {
      const result = await GetPaymentAggregatorService.execute(req.query, req.context)
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
  static async updatePaymentProvider (req, res, next) {
    try {
      let depositImage, withdrawImage

      if (req.files) {
        for (const image of req.files) {
          if (image.fieldname === 'depositImage') depositImage = image
          else if (image.fieldname === 'withdrawImage') withdrawImage = image

          const imageCheckResponse = validateFile(res, image)
          if (imageCheckResponse !== OK) return res.status(400).json({ errCode: StatusCodes.BAD_REQUEST, message: imageCheckResponse })
        }
      }

      const result = await UpdatePaymentProviderService.execute({ ...req.body, depositImage, withdrawImage }, req.context)
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
  static async createPaymentProvider (req, res, next) {
    try {
      let depositImage, withdrawImage

      if (req.files) {
        for (const image of req.files) {
          if (image.fieldname === 'depositImage') depositImage = image
          else if (image.fieldname === 'withdrawImage') withdrawImage = image

          const imageCheckResponse = validateFile(res, image)
          if (imageCheckResponse !== OK) return res.status(400).json({ errCode: StatusCodes.BAD_REQUEST, message: imageCheckResponse })
        }
      }

      const result = await CreatePaymentProviderService.execute({ ...req.body, depositImage, withdrawImage }, req.context)
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
  static async getWithdrawals (req, res, next) {
    try {
      const result = await GetWithdrawalsService.execute(req.query, req.context)
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
  static async approveRejectWithdrawal (req, res, next) {
    try {
      const result = await ApproveRejectWithdrawalsService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async getUserPaymentCards (req, res, next) {
    try {
      const result = await GetUserPaymentCardsService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
