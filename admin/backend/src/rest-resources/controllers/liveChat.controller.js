import { decorateResponse } from '@src/helpers/response.helpers'
import CreateChatGroupService from '@src/services/chatModule/Group/createChatGroup.service'
import GetAllChatGroupService from '@src/services/chatModule/Group/getAllChatGroup.service'
import GetChatGroupUsersService from '@src/services/chatModule/Group/getChatGroupUsers.service'
import GetGroupMessageService from '@src/services/chatModule/Group/getGroupMessage.service'
import UpdateChatGroupService from '@src/services/chatModule/Group/updateChatGroup.service'
import CreateChatRainService from '@src/services/chatModule/chatRain/createChatRain.service'
import GetChatRainUsersService from '@src/services/chatModule/chatRain/getChatRain.service'
import UpdateChatRainService from '@src/services/chatModule/chatRain/updateChatRain.service'
import GetUserMessageService from '@src/services/chatModule/message/getUserMessage.service'
import CreateOffensiveWordService from '@src/services/chatModule/offensiveWord/createOffensiveWord.service'
import DeleteOffensiveWordService from '@src/services/chatModule/offensiveWord/deleteOffensiveWord.service'
import GetOffensiveWordService from '@src/services/chatModule/offensiveWord/fetchOffensiveWords.service'
import GetReportedUserService from '@src/services/chatModule/reportedUser/getReportedUser.service'

export class LiveChatController {
  static async createChatRain (req, res, next) {
    try {
      const result = await CreateChatRainService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async updateChatRain (req, res, next) {
    try {
      const result = await UpdateChatRainService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getChatRain (req, res, next) {
    try {
      const result = await GetChatRainUsersService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getOffensiveWords (req, res, next) {
    try {
      const result = await GetOffensiveWordService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async createOffensiveWord (req, res, next) {
    try {
      const result = await CreateOffensiveWordService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async deleteOffensiveWord (req, res, next) {
    try {
      const result = await DeleteOffensiveWordService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async createChatGroup (req, res, next) {
    try {
      const result = await CreateChatGroupService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async updateChatGroup (req, res, next) {
    try {
      const result = await UpdateChatGroupService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getChatGroup (req, res, next) {
    try {
      const result = await GetAllChatGroupService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getReportedUser (req, res, next) {
    try {
      const result = await GetReportedUserService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  // static async createChatRule (req, res, next) {
  //   try {
  //     const result = await CreateChatRuleService.execute(req.body, req.context)
  //     decorateResponse({ req, res, next }, result)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // static async updateChatRule (req, res, next) {
  //   try {
  //     const result = await UpdateChatRuleService.execute(req.body, req.context)
  //     decorateResponse({ req, res, next }, result)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // static async getChatRule (req, res, next) {
  //   try {
  //     const result = await GetChatRuleService.execute(req.query, req.context)
  //     decorateResponse({ req, res, next }, result)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  static async getUserMessage (req, res, next) {
    try {
      const result = await GetUserMessageService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getChatGroupUser (req, res, next) {
    try {
      const result = await GetChatGroupUsersService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getGroupMessage (req, res, next) {
    try {
      const result = await GetGroupMessageService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
