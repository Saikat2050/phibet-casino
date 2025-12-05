import { decorateResponse } from '@src/helpers/response.helpers'
import { CreateCommentService } from '@src/services/playerManagement/createComment.service'
import { DeleteCommentService } from '@src/services/playerManagement/deleteComment.service'
import { GetDuplicatePlayersService } from '@src/services/playerManagement/getDuplicatePlayers.service'
import { GetPlayerService } from '@src/services/playerManagement/getPlayer.service'
import { GetPlayerCommentsService } from '@src/services/playerManagement/getPlayerComments.service'
import { GetPlayersService } from '@src/services/playerManagement/getPlayers.service'
import { ManageUserWalletService } from '@src/services/playerManagement/manageUserWallet.service'
import { ResetPlayerPasswordService } from '@src/services/playerManagement/resetPlayerPassword.service'
import { ResetUpdateProfileLimitService } from '@src/services/playerManagement/resetUpdateProfileLimit.service'
import { TogglePlayerService } from '@src/services/playerManagement/togglePlayer.service'
import { UpdateCommentService } from '@src/services/playerManagement/updateComment.service'
import { UpdatePlayerService } from '@src/services/playerManagement/updatePlayer.service'
import { UpdatePlayerPasswordService } from '@src/services/playerManagement/updatePlayerPassword.service'

export class PlayerController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getPlayers (req, res, next) {
    try {
      const result = await GetPlayersService.execute(req.query, req.context)
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
  static async getPlayer (req, res, next) {
    try {
      const result = await GetPlayerService.execute(req.query, req.context)
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
  static async getDuplicatePlayers (req, res, next) {
    try {
      const result = await GetDuplicatePlayersService.execute(req.query, req.context)
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
  static async updatePlayer (req, res, next) {
    try {
      const result = await UpdatePlayerService.execute(req.body, req.context)
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
  static async updatePlayerPassword (req, res, next) {
    try {
      const result = await UpdatePlayerPasswordService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async resetPlayerPassword (req, res, next) {
    try {
      const result = await ResetPlayerPasswordService.execute(req.body, req.context)
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
    static async getPlayerComments (req, res, next) {
      try {
        const result = await GetPlayerCommentsService.execute(req.query, req.context)
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
  static async createComment (req, res, next) {
    try {
      const result = await CreateCommentService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async updateComment (req, res, next) {
    try {
      const result = await UpdateCommentService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async deleteComment (req, res, next) {
    try {
      const result = await DeleteCommentService.execute(req.body, req.context)
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
  static async togglePlayer (req, res, next) {
    try {
      const result = await TogglePlayerService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async manageUserWallet (req, res, next) {
    try {
      const result = await ManageUserWalletService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async resetProfileUpdateLimit (req, res, next) {
    try {
      const result = await ResetUpdateProfileLimitService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
