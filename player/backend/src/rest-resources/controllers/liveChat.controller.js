import { decorateResponse } from '@src/helpers/response.helpers'
import { GetChatGroupService } from '@src/services/chatModule/LiveChat/getChatGroup.service'
import { GetGroupChatService } from '@src/services/chatModule/LiveChat/getGroupChat.service'
import { JoinGroupChatService } from '@src/services/chatModule/LiveChat/joinChatGroup.service'
import { SendMessageService } from '@src/services/chatModule/LiveChat/sendMessage.service'
import { ShareEventService } from '@src/services/chatModule/LiveChat/shareEvent.service'
import { ClaimChatRainService } from '@src/services/chatModule/chatRain/claimChatRain.service'
import { GetChatRainService } from '@src/services/chatModule/chatRain/getChatrain.service'
import { GetChatThemeService } from '@src/services/chatModule/theme/getTheme.service'
import { SendUserTipService } from '@src/services/chatModule/tip/sendUserTip.service'

/**
 * LiveChat Controller for handling all the request of /ReportedUser path
 *
 * @export
 * @class LiveChatController
 */

export class LiveChatController {
  static async getChatGroup (req, res, next) {
    try {
      const result = await GetChatGroupService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async joinChatGroup (req, res, next) {
    try {
      const result = await JoinGroupChatService.execute({ userId: req.authenticated.userId, ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async sendMessage (req, res, next) {
    try {
      const result = await SendMessageService.execute({ ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getUserChat (req, res, next) {
    try {
      const result = await GetGroupChatService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async sendTip (req, res, next) {
    try {
      const result = await SendUserTipService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async claimChatRain (req, res, next) {
    try {
      const result = await ClaimChatRainService.execute({ userId: req.authenticated.userId, ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getChatRain (req, res, next) {
    try {
      const result = await GetChatRainService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getTheme (req, res, next) {
    try {
      const result = await GetChatThemeService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async shareEvent (req, res, next) {
    try {
      const result = await ShareEventService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
