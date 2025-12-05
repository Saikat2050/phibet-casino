import { decorateResponse } from '@src/helpers/response.helpers'
import CreateChatDetailsService from '@src/services/chatModule/chatDetails/createChatDetails.service'
import FetchChatDetailsService from '@src/services/chatModule/chatDetails/fetchChatDetails.service'
import CreateChatGroupService from '@src/services/chatModule/chatGroup/createChatGroup.service'
import FetchChatGroupService from '@src/services/chatModule/chatGroup/fetchChatGroup.service'
/**
 * LiveChat Controller for handling all the request of /ReportedUser path
 *
 * @export
 * @class LiveChatController
 */

export class ChatController {
  static async createChatGroup (req, res, next) {
    try {
      const result = await CreateChatGroupService.execute(
        { ...req.body, userId: req.authenticated.userId },
        req.context
      )
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async fetchChatGroup (req, res, next) {
    try {
      const result = await FetchChatGroupService.execute(
        { ...req.body, ...req.query, userId: req.authenticated.userId },
        req.context
      )
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async createChatDetails (req, res, next) {
    try {
      const result = await CreateChatDetailsService.execute(
        { ...req.body, userId: req.authenticated.userId },
        req.context
      )
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async fetchChatDetails (req, res, next) {
    try {
      const result = await FetchChatDetailsService.execute(
        { ...req.body, ...req.query, userId: req.authenticated.userId },
        req.context
      )
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
