import { decorateResponse } from '@src/helpers/response.helpers'
import { CreateJackpotService } from '@src/services/jackpot/createJackpot.service'
import { DeleteJackpotService } from '@src/services/jackpot/deleteJackpot.service'
import { GenerateRnGService } from '@src/services/jackpot/generateRnG.service'
import { GetAllJackpotDetailService } from '@src/services/jackpot/getJackpotDetails.service'
import { GetJackpotGraphService } from '@src/services/jackpot/getJackpotGraph.service'
import { GetCurrentJackpotInfoService } from '@src/services/jackpot/reports/getCurrentJackpotInfo.service'
import { GetJackpotTabsInfoService } from '@src/services/jackpot/reports/getJackpotTabInfo.service'
import { UpdateJackpotService } from '@src/services/jackpot/updateJackpot.service'

export class JackpotController {
  /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
  static async getAllJackpot (req, res, next) {
    try {
      const result = await GetAllJackpotDetailService.execute(req.query, req.context)
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
  static async createJackpot (req, res, next) {
    try {
      const result = await CreateJackpotService.execute(req.body, req.context)
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
  static async updateJackpot (req, res, next) {
    try {
      const result = await UpdateJackpotService.execute(req.body, req.context)
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
  static async deleteJackpot (req, res, next) {
    try {
      const result = await DeleteJackpotService.execute(req.body, req.context)
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
  static async getJackpotTabs (req, res, next) {
    try {
      const result = await GetJackpotTabsInfoService.execute(req.body, req.context)
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
  static async getCurrentJackpotInfo (req, res, next) {
    try {
      const result = await GetCurrentJackpotInfoService.execute(req.body, req.context)
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
  static async generateRandomWinningData (req, res, next) {
    try {
      const result = await GenerateRnGService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getJackpotGraph (req, res, next) {
    try {
      const result = await GetJackpotGraphService.execute({ ...req.body, ...req.query }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
