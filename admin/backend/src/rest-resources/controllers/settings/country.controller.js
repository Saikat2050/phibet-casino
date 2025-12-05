import { decorateResponse } from '@src/helpers/response.helpers'
import { GetCountriesService } from '@src/services/country/getCountries.service'
import { ToggleCountryService } from '@src/services/country/toggleCountry.service'
import { UpdateCountryService } from '@src/services/country/updateCountry.service'

export class CountryController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getCountries (req, res, next) {
    try {
      const result = await GetCountriesService.execute(req.query, req.context)
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
  static async updateCountry (req, res, next) {
    try {
      const result = await UpdateCountryService.execute(req.body, req.context)
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
  static async toggleCountry (req, res, next) {
    try {
      const result = await ToggleCountryService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
