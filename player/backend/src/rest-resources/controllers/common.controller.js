import { decorateResponse } from '@src/helpers/response.helpers'
import { GetBannersService } from '@src/services/common/getBanners.service'
import { GetCountriesService } from '@src/services/common/getCountries.service'
import { GetCurrenciesService } from '@src/services/common/getCurrencies.service'
import { GetLanguagesService } from '@src/services/common/getLanguages.service'
import { GetPagesService } from '@src/services/common/getPages.service'
import { GetSettingsService } from '@src/services/common/getSettings.service'
import { GetPaymentProvidersService } from '@src/services/payment/getPaymentProvider.service'
import { SubscribeNotificationService } from '@src/services/notifications/subscribeNotification.service'
import { GetUserNotificationService } from '@src/services/notifications/getUserNotification.service'
import { GetStatesService } from '@src/services/common/getStates.service'
import { GetTopWinnersService } from '@src/services/common/getTopWinners.service'
import { GetSeoPagesService } from '@src/services/common/getAllSeoPages.service'
import { GetLicenseString } from '@src/services/common/getLicenseString.service'
import DecodeToken from '@src/services/common/decodeResponseToken.service'
import { GetTestimonialsService } from '@src/services/common/getTestimonials.service'

export class CommonController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getSettings (req, res, next) {
    try {
      const result = await GetSettingsService.execute({}, req.context)
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
  static async getLanguages (req, res, next) {
    try {
      const result = await GetLanguagesService.execute({}, req.context)
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
  static async getCurrencies (req, res, next) {
    try {
      const result = await GetCurrenciesService.execute({}, req.context)
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
  static async getBanners (req, res, next) {
    try {
      const result = await GetBannersService.execute({}, req.context)
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
  static async getCountries (req, res, next) {
    try {
      const result = await GetCountriesService.execute({}, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getPaymentProviders (req, res, next) {
    try {
      const result = await GetPaymentProvidersService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async notificationSubscribe (req, res, next) {
    try {
      const result = await SubscribeNotificationService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getUserNotification (req, res, next) {
    try {
      const result = await GetUserNotificationService.execute({ ...req.query, userId: req?.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getStates (req, res, next) {
    try {
      const result = await GetStatesService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getTopWinners (req, res, next) {
    try {
      const result = await GetTopWinnersService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getAllSeoPages (req, res, next) {
    try {
      const result = await GetSeoPagesService.execute({ ...req.query }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getLicenseString (req, res, next) {
    try {
      const result = await GetLicenseString.execute({ ...req.query }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async decodeResponseToken (req, res, next) {
    try {
      const result = await DecodeToken.execute({ ...req.query, ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getTestimonials (req, res, next) {
    try {
      const result = await GetTestimonialsService.execute({}, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
