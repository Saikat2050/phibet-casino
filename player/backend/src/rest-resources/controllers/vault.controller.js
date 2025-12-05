import { decorateResponse } from '@src/helpers/response.helpers'
import { VaultService } from '@src/services/vault/coinVault.service'

export class VaultController {
  static async vault (req, res, next) {
    try {
      const result = await VaultService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
