import { decorateResponse } from '@src/helpers/response.helpers'
import { GetTransactionDetailService } from '@src/services/payment/getTransactionDetail.service'
import { GetPackagesService } from '@src/services/store/getPackages.service'
import { PurchasePackageService } from '@src/services/store/puchasePackage.service'
import { RedeemCoinsService } from '@src/services/store/redeemCoins.service'
import { getIp } from '@src/utils'

export class StoreController {
  /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
  static async getPackages (req, res, next) {
    try {
      const result = await GetPackagesService.execute({ ...req.query, userId: req?.authenticated?.userId }, req.context)
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
  static async puchasePackage (req, res, next) {
    try {
      const result = await PurchasePackageService.execute({ ...req.body, ipAddress: getIp(req) }, req.context)
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
  static async redeemCoins (req, res, next) {
    try {
      const result = await RedeemCoinsService.execute({ ...req.body, userId: req?.authenticated?.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getTransactionDetail (req, res, next) {
    try {
      const result = await GetTransactionDetailService.execute({ ...req.query, userId: req?.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
