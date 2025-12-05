import { decorateResponse } from '@src/helpers/response.helpers'
import { GetStatesService } from '@src/services/state/getStates.service'
import { ToggleStateService } from '@src/services/state/toggleState.service'

export class StateController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getSates (req, res, next) {
    try {
      const result = await GetStatesService.execute(req.query, req.context)
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
  static async toggleState (req, res, next) {
    try {
      const result = await ToggleStateService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
