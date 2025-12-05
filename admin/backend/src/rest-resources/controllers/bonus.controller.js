import { decorateResponse } from '@src/helpers/response.helpers'
import { CreateBonusService } from '@src/services/bonus/createBonus.service'
import { GetAllBonusService } from '@src/services/bonus/getAllBonus.service'
import { IssueBonusService } from '@src/services/bonus/issueBonus.service'
import { ToggleBonusService } from '@src/services/bonus/toggleBonus.service'
import { DeleteBonusService } from '@src/services/bonus/deleteBonus.service'
import { GetBonusDetailService } from '@src/services/bonus/getBonusDetail.service'
import { UpdateBonusService } from '@src/services/bonus/updateBonus.service'

export default class BonusController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async createBonus (req, res, next) {
    try {
      const result = await CreateBonusService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async updateBonus (req, res, next) {
    try {
      const result = await UpdateBonusService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async issueBonus (req, res, next) {
    try {
      const result = await IssueBonusService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async getAllBonus (req, res, next) {
    try {
      const result = await GetAllBonusService.execute(req.query, req.context)
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
  static async getBonusDetail (req, res, next) {
    try {
      const result = await GetBonusDetailService.execute(req.query, req.context)
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
  static async deleteBonus (req, res, next) {
    try {
      const result = await DeleteBonusService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async toggleBonus (req, res, next) {
    try {
      const result = await ToggleBonusService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
