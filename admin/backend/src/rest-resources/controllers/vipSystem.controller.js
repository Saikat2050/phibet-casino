import { decorateResponse } from '@src/helpers/response.helpers'
import { CreateVipTiers } from '@src/services/vipSystem/CreateVipTiers.service'
import { GetVipTiersService } from '@src/services/vipSystem/GetVipTiers.service'
import { GetVipTiersDetailsService } from '@src/services/vipSystem/GetVipTiersDetails.service'
import { UpdateVipTiers } from '@src/services/vipSystem/UpdateVipTiers.service'

export default class VipSystemController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async createVipTiers (req, res, next) {
    try {
      const result = await CreateVipTiers.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async updateVipTiers (req, res, next) {
    try {
      const result = await UpdateVipTiers.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async getVipTiers (req, res, next) {
    try {
      const result = await GetVipTiersService.execute({ ...req.query }, req.context)
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
  static async getVipTierDetails (req, res, next) {
    try {
      const result = await GetVipTiersDetailsService.execute({ ...req.query }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
