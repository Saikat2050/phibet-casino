import { decorateResponse } from '@src/helpers/response.helpers'
import { CancelTournamentService } from '@src/services/tournaments/cancelTournament.service'
import { CreateTournamentService } from '@src/services/tournaments/createTournament.service'
import { DeleteTournamentGames } from '@src/services/tournaments/deleteTournamentGames.service'
import { GetTournamentsService } from '@src/services/tournaments/getTournament.service'
import { GetTournamentDetailsService } from '@src/services/tournaments/getTournamentDetails.service'
import { ToggleTournamentService } from '@src/services/tournaments/toggleTournament.service'
import { TournamentLeaderBoardService } from '@src/services/tournaments/tournamentLeaderboard.service'
import { TournamentSettlementService } from '@src/services/tournaments/tournamentSettlement.service'
import { TournamentTransactionService } from '@src/services/tournaments/tournamentTransaction.service'
import { UpdateTournamentsService } from '@src/services/tournaments/updateTournament.service'

export default class TournamentController {
  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async createTournament (req, res, next) {
    try {
      const result = await CreateTournamentService.execute({ ...req.body, image: req.file }, req.context)
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
  static async getAllTournaments (req, res, next) {
    try {
      const result = await GetTournamentsService.execute(req.query, req.context)
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
  static async getTournamentsDetail (req, res, next) {
    try {
      const result = await GetTournamentDetailsService.execute(req.query, req.context)
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
  static async updateTournament (req, res, next) {
    try {
      const result = await UpdateTournamentsService.execute({ ...req.body, image: req.file }, req.context)
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
  static async deleteTournamentGames (req, res, next) {
    try {
      const result = await DeleteTournamentGames.execute(req.body, req.context)
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
  static async toggleTournament (req, res, next) {
    try {
      const result = await ToggleTournamentService.execute(req.body, req.context)
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
  static async getTournamentTransactions (req, res, next) {
    try {
      const result = await TournamentTransactionService.execute(req.query, req.context)
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
  static async getTournamentLeaderBoards (req, res, next) {
    try {
      const result = await TournamentLeaderBoardService.execute(req.query, req.context)
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
  static async tournamentSettlement (req, res, next) {
    try {
      const result = await TournamentSettlementService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async cancelTournament (req, res, next) {
    try {
      const result = await CancelTournamentService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
