import { decorateResponse } from '@src/helpers/response.helpers'
import { GetSettingsService } from '@src/services/common/getSettings.service'
import { ToggleSettingsService } from '@src/services/setting/toggleSettings.service'
import { UpdateConstantSettingsService } from '@src/services/setting/updateConstantSettings.service'
import { UpdateLogoService } from '@src/services/setting/updateLogo.service'
import { UpdateValueComparisonSettingsService } from '@src/services/setting/updateValueComparisonSettings.service'

export class SettingController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getSettings (req, res, next) {
    try {
      const result = await GetSettingsService.execute(req.query, req.context)
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
  static async toggleSettings (req, res, next) {
    try {
      const result = await ToggleSettingsService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async updateConstantSettings (req, res, next) {
    try {
      const result = await UpdateConstantSettingsService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async updateLogo (req, res, next) {
    try {
      const result = await UpdateLogoService.execute({ ...req.body, file: req.file }, req.context)
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
  static async updateValueComparisonSettings (req, res, next) {
    try {
      const result = await UpdateValueComparisonSettingsService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
