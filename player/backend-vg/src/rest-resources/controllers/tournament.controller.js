import { sendResponse } from '../../utils/response.helpers'
import { GetAllTournamentService, GetTournamentDetailsService, JoinTournamentService } from '../../services/tournament'

export default class TournamentController {
  static async getAllTournament (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllTournamentService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getTournamentDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetTournamentDetailsService.execute({ ...req.params }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async joinTournament (req, res, next) {
    try {
      const { result, successful, errors } = await JoinTournamentService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
