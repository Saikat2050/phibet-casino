import { decorateResponse } from '@src/helpers/response.helpers'
import { CreateSeoPageService } from '@src/services/seoPages/createSeoPage.service'
import { DeleteSeoPageService } from '@src/services/seoPages/deleteSeoPage.service'
import { GetSeoPageService } from '@src/services/seoPages/getSeoPage.service'
import { GetSeoPagesService } from '@src/services/seoPages/getSeoPages.service'
import { UpdateSeoPageService } from '@src/services/seoPages/updateSeoPage.service'

export class SeoPageController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getSeoPage (req, res, next) {
    try {
      const result = await GetSeoPageService.execute(req.query, req.context)
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
  static async getSeoPages (req, res, next) {
    try {
      const result = await GetSeoPagesService.execute(req.query, req.context)
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
  static async createSeoPage (req, res, next) {
    try {
      const result = await CreateSeoPageService.execute(req.body, req.context)
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
  static async updateSeoPage (req, res, next) {
    try {
      const result = await UpdateSeoPageService.execute(req.body, req.context)
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
  static async deleteSeoPage (req, res, next) {
    try {
      const result = await DeleteSeoPageService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
