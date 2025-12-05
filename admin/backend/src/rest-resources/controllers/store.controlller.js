import { decorateResponse } from '@src/helpers/response.helpers'
import { CreatePackageService } from '@src/services/store/createPackage.service'
import { DeletePackageService } from '@src/services/store/deletePackage.service'
import { GetPackageService } from '@src/services/store/getPackage.service'
import { GetPackagesService } from '@src/services/store/getPackages.service'
import { ReorderPackagesService } from '@src/services/store/reorderPackages.service'
import { UpdatePackageService } from '@src/services/store/updatePackage.service'

export class StoreController {
  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async getPackages (req, res, next) {
    try {
      const result = await GetPackagesService.execute(req.query, req.context)
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
  static async createPackage (req, res, next) {
    try {
      const result = await CreatePackageService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async updatePackage (req, res, next) {
    try {
      const result = await UpdatePackageService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async deletePackage (req, res, next) {
    try {
      const result = await DeletePackageService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async getPackage (req, res, next) {
    try {
      const result = await GetPackageService.execute(req.query, req.context)
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
  static async reorderPackage (req, res, next) {
    try {
      const result = await ReorderPackagesService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
