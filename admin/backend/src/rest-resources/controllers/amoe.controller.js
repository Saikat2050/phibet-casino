import { decorateResponse } from '@src/helpers/response.helpers'
import { GetAllAmoEntriesService } from '@src/services/amoe/getAllAmoEntries.service'
import { ManageAmoEntriesService } from '@src/services/amoe/manageAmoEntries.service'
import { UpdateAmoeAddressService } from '@src/services/amoe/updateAmoeAddress.service'

export class AmoeController {
  /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
  static async getAllAmoEnties (req, res, next) {
    try {
      const result = await GetAllAmoEntriesService.execute(req.query, req.context)
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
  static async updateAmoeAddress (req, res, next) {
    try {
      const result = await UpdateAmoeAddressService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async manageAmoEntries (req, res, next) {
    try {
      const result = await ManageAmoEntriesService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
