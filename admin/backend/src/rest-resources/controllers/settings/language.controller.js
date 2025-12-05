import { decorateResponse } from '@src/helpers/response.helpers'
import { GetLanguagesService } from '@src/services/language/getLanguages.service'
import { ToggleLanguageService } from '@src/services/language/toggleLanguage.service'

export class LanguageController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getLanguages (req, res, next) {
    try {
      const result = await GetLanguagesService.execute(req.query, req.context)
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
  static async toggleLanguage (req, res, next) {
    try {
      const result = await ToggleLanguageService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
