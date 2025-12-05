import { decorateResponse } from '@src/helpers/response.helpers'
import { GetBlockedUserService } from '@src/services/chatModule/reportedUsers/getBlockedUser.service.js'
import { blockUserService } from '@src/services/chatModule/reportedUsers/blockUser.service.js'
import { UnblockUserService } from '@src/services/chatModule/reportedUsers/unblockUser.service.js'

/**
 * BlockedUser Controller for handling all the request of /ReportedUser path
 *
 * @export
 * @class BlockedUserController
 */
export class BlockedUserController {
  /**
   * Controller method for BlockedUser
   *
   * @static
   * @param {object} req - object contains all the request body sent from the client
   * @param {object} res - object contains all the response params sent to the client
   * @param {function} next - function to execute next middleware
   * @memberof BlockedUserController
   */

  static async getBlockedUser (req, res, next) {
    try {
      const result = await GetBlockedUserService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async blockUser (req, res, next) {
    try {
      const result = await blockUserService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async unblockUser (req, res, next) {
    try {
      const result = await UnblockUserService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
