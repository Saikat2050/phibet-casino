import { decorateResponse } from '@src/helpers/response.helpers'
import { CancelBonusService } from '@src/services/bonus/cancelBonus.service'
import { AvailBonusService } from '@src/services/bonus/availBonus.service'
import { GetAllBonusService } from '@src/services/bonus/getAllBonus.service'
import { GetBonusDetailService } from '@src/services/bonus/getBonusDetail.service'
import { GetUserBonusService } from '@src/services/bonus/getUserBonus.service'
import { getIp } from '@src/utils'
import { AvailDailyBonusService } from '@src/services/bonus/availDailyBonus.service'
import { AvailJoiningBonusService } from '@src/services/bonus/availJoiningBonus.service'
import { AvailBirthdayBonusService } from '@src/services/bonus/availBirthdayBonus.service'

export default class BonusController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getAllBonus (req, res, next) {
    try {
      const result = await GetAllBonusService.execute({ ...req.query, ipAddress: getIp(req), userId: req?.authenticated?.userId }, req.context)
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
      const result = await GetBonusDetailService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
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
  static async getUserBonus (req, res, next) {
    try {
      const result = await GetUserBonusService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async availBonus (req, res, next) {
    try {
      const result = await AvailBonusService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async cancelBonus (req, res, next) {
    try {
      const result = await CancelBonusService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async availDailyBonus (req, res, next) {
    try {
      const result = await AvailDailyBonusService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async availJoiningBonus (req, res, next) {
    try {
      const result = await AvailJoiningBonusService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
 static async availBirthdayBonus (req, res, next) {
    try {
      const result = await AvailBirthdayBonusService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
  // static async getCashback (req, res, next) {
  //   try {
  //     const { result, successful, errors } = await GetCashbackBalanceService.execute(req.body)
  //     decorateResponse({ req, res, next }, result)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // static async getCashbackBonus (req, res, next) {
  //   try {
  //     const { result, successful, errors } = await GetCashbackBonusService.execute({ ...req.body, userId: userId(req) })
  //     decorateResponse({ req, res, next }, result)
  //   } catch (error) {
  //     next(error)
  //   }
  // }
}
