import { decorateResponse } from '@src/helpers/response.helpers'
import FetchGlobalChatSettings from '@src/services/chatModule/chatSettings/fetchGlobalChatSettings.service'
import UpdateGlobalChatSettings from '@src/services/chatModule/chatSettings/updateGlobalChatSettings.service'
import CreateChatGroupService from '@src/services/chatModule/chatGroup/createChatGroup.service'
import UpdateChatGroupService from '@src/services/chatModule/chatGroup/updateChatGroup.service'
import FetchChatGroupService from '@src/services/chatModule/chatGroup/fetchChatGroup.service'
import DeleteChatGroupService from '@src/services/chatModule/chatGroup/deleteChatGroup.service'
import FetchChatDetailsService from '@src/services/chatModule/chatDetails/fetchChatDetails.service'
import CreateOffensiveWordService from '@src/services/chatModule/offensiveWord/createOffensiveWord.service'
import FetchOffensiveWordService from '@src/services/chatModule/offensiveWord/fetchOffensiveWords.service'
import DeleteOffensiveWordService from '@src/services/chatModule/offensiveWord/deleteOffensiveWord.service'

export class ChatController {
  static async fetchGlobalChatSettings (req, res, next) {
    try {
      const result = await FetchGlobalChatSettings.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async updateGlobalChatSettings (req, res, next) {
    try {
      const result = await UpdateGlobalChatSettings.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async createChatGroup (req, res, next) {
    try {
      const result = await CreateChatGroupService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async updateChatGroup (req, res, next) {
    try {
      const result = await UpdateChatGroupService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async fetchChatGroup (req, res, next) {
    try {
      const result = await FetchChatGroupService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async deleteChatGroup (req, res, next) {
    try {
      const result = await DeleteChatGroupService.execute({ ...req.query, ...req.params, ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async fetchChatDetails (req, res, next) {
    try {
      const result = await FetchChatDetailsService.execute({ ...req.query, ...req.params, ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async createOffensiveWord (req, res, next) {
    try {
      const result = await CreateOffensiveWordService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async fetchOffensiveWords (req, res, next) {
    try {
      const result = await FetchOffensiveWordService.execute({ ...req.query, ...req.params, ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async deleteOffensiveWord (req, res, next) {
    try {
      const result = await DeleteOffensiveWordService.execute({ ...req.query, ...req.params, ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
