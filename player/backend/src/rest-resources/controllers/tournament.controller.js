import { decorateResponse } from '@src/helpers/response.helpers'
import { GetTournamentsService } from '@src/services/tournament/getTournament.service'
import { GetTournamentDetailsService } from '@src/services/tournament/getTournamentDetails.service'
import { EnrollTournamentService } from '@src/services/tournament/enrollTournament.service'
import { GetLeaderBoardService } from '@src/services/tournament/getLeaderBoard.service'
import { TournamentTransactionService } from '@src/services/tournament/tournamentTransaction.service'
import { GetMyTournamentsService } from '@src/services/tournament/getMyTournament.service'
import { RebuyTournamentPointsService } from '@src/services/tournament/rebuyTournamentPoints.service'

export class TournamentController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getAllTournaments (req, res, next) {
    try {
      const result = await GetTournamentsService.execute({ ...req.query, userId: req?.authenticated?.userId }, req.context)
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
  static async getTournamentDetail (req, res, next) {
    try {
      const result = await GetTournamentDetailsService.execute({ ...req.query, userId: req?.authenticated?.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async enrollTournament (req, res, next) {
    try {
      const result = await EnrollTournamentService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getLeaderBoardData (req, res, next) {
    try {
      const result = await GetLeaderBoardService.execute({ ...req.query }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getTournamentTransactions (req, res, next) {
    try {
      const result = await TournamentTransactionService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
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
  static async getMyTournaments (req, res, next) {
    try {
      const result = await GetMyTournamentsService.execute({ ...req.query, userId: req?.authenticated?.userId }, req.context)
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
  static async rebuyTournamentPoints (req, res, next) {
    try {
      const result = await RebuyTournamentPointsService.execute({ ...req.body, userId: req?.authenticated?.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
