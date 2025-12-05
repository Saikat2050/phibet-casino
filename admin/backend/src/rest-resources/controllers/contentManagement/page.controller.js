import { decorateResponse } from '@src/helpers/response.helpers'
import { CreatePageService } from '@src/services/page/createPage.service'
import { DeletePageService } from '@src/services/page/deletePage.service'
import { GetPageService } from '@src/services/page/getPage.service'
import { GetPagesService } from '@src/services/page/getPages.service'
import { TogglePageService } from '@src/services/page/togglePage.service'
import { UpdatePageService } from '@src/services/page/updatePage.service'

export class PageController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getPage (req, res, next) {
    try {
      const result = await GetPageService.execute(req.query, req.context)
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
  static async getPages (req, res, next) {
    try {
      const result = await GetPagesService.execute(req.query, req.context)
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
  static async createPage (req, res, next) {
    try {
      const result = await CreatePageService.execute(req.body, req.context)
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
  static async updatePage (req, res, next) {
    try {
      const result = await UpdatePageService.execute(req.body, req.context)
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
  static async togglePage (req, res, next) {
    try {
      const result = await TogglePageService.execute(req.body, req.context)
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
  static async deletePage (req, res, next) {
    try {
      const result = await DeletePageService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
