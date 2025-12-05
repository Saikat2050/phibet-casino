import { TournamentController } from '@src/rest-resources/controllers/tournament.controller'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { isSemiAuthenticated } from '@src/rest-resources/middlewares/isSemiAuthenticated'
import express from 'express'

const tournamentRouter = express.Router({ mergeParams: true })

// GET REQUESTS
tournamentRouter.get('/detail', isSemiAuthenticated, TournamentController.getTournamentDetail, responseValidationMiddleware({}))
tournamentRouter.get('/', isSemiAuthenticated, TournamentController.getAllTournaments, responseValidationMiddleware({}))
tournamentRouter.get('/leaderboard', TournamentController.getLeaderBoardData, responseValidationMiddleware({}))
tournamentRouter.get('/my-tournaments', isAuthenticated, TournamentController.getMyTournaments, responseValidationMiddleware({}))
tournamentRouter.get('/tournament-transactions', isAuthenticated, TournamentController.getTournamentTransactions, responseValidationMiddleware({}))

// POST REQUEST
tournamentRouter.post('/tournament-enroll', isAuthenticated, databaseTransactionHandlerMiddleware, TournamentController.enrollTournament, responseValidationMiddleware({}))
tournamentRouter.post('/rebuy-tournament-points', isAuthenticated, databaseTransactionHandlerMiddleware, TournamentController.rebuyTournamentPoints, responseValidationMiddleware({}))

export { tournamentRouter }
