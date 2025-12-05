import { decorateResponse } from '@src/helpers/response.helpers'
import { GetAllCasinoGamesService } from '@src/services/casino/getAllGames.service'
import { GetCasinoCategoryService } from '@src/services/casino/getCasinoCategory.service'
import { GetCasinoProvidersService } from '@src/services/casino/getCasinoProviders.service'
import { GetCasinoTransactionService } from '@src/services/casino/getCasinoTransactions.service'
import { GetCategoryGamesService } from '@src/services/casino/getCategoryGames.service'
import { GetFavoriteGamesService } from '@src/services/casino/getFavoriteGames.service'
import { InitDemoGameService } from '@src/services/casino/initDemo.service'
import { InitGameService } from '@src/services/casino/initGame.service'
import { ToggleFavoriteGameService } from '@src/services/casino/toggleFavoriteGame.service'
import { getIp } from '@src/utils'

export class CasinoController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getAllGames (req, res, next) {
    try {
      const result = await GetAllCasinoGamesService.execute({ ...req.query, userId: req?.authenticated?.userId, stateCode: req?.headers?.statecode, ipAddress: getIp(req) }, req.context)
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
  static async getGameProvider (req, res, next) {
    try {
      const result = await GetCasinoProvidersService.execute({ ...req.body, ipAddress: getIp(req) }, req.context)
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
  static async getGameCategory (req, res, next) {
    try {
      const result = await GetCasinoCategoryService.execute({ stateCode: req?.headers?.statecode, ipAddress: getIp(req), ...req.query }, req.context)
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
  static async toggleFavoriteGame (req, res, next) {
    try {
      const result = await ToggleFavoriteGameService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
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
  static async getFavoriteGame (req, res, next) {
    try {
      const result = await GetFavoriteGamesService.execute({ ...req.query, userId: req.authenticated.userId, ipAddress: getIp(req) }, req.context)
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
  static async initGame (req, res, next) {
    try {
      const result = await InitGameService.execute({ ...req.body, userId: req.authenticated.userId, stateCode: req?.headers?.statecode, ipAddress: getIp(req) }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async demoGame (req, res, next) {
    try {
      const result = await InitDemoGameService.execute({ ...req.body, ipAddress: getIp(req) }, req.context)
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
  static async getCasinoTransactions (req, res, next) {
    try {
      const result = await GetCasinoTransactionService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
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
  static async getCategorygames (req, res, next) {
    try {
      const result = await GetCategoryGamesService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
