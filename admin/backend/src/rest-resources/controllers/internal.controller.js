import { decorateResponse } from '@src/helpers/response.helpers'
import { CreateCredentialsService } from '@src/services/internal/providerCredentials/createCredentials.service'
import { GetCredentialsService } from '@src/services/internal/providerCredentials/getCredentials.service'
import { UpdateCredentialsService } from '@src/services/internal/providerCredentials/updateCredentials.service'
import { ResetSuperAdminPermissions } from '@src/services/internal/resetSuperAdminPermissions'

export class CredentialsController {
  /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
  static async createCredentials (req, res, next) {
    try {
      const result = await CreateCredentialsService.execute({ ...req.body, icon: req.file }, req.context)
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
  static async getCredentials (req, res, next) {
    try {
      const result = await GetCredentialsService.execute({ ...req.query }, req.context)
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
  static async updateCredentials (req, res, next) {
    try {
      const result = await UpdateCredentialsService.execute({ ...req.body, icon: req.file }, req.context)
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
  static async resetSuperAdmin (req, res, next) {
    try {
      const result = await ResetSuperAdminPermissions.execute({ ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
