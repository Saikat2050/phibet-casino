import TournamentController from '@src/rest-resources/controllers/tournament.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { successSchema } from '@src/schema/successResponse.schema'
import { createTournamentSchema } from '@src/schema/tournament/createTournament.schema'
import { getTournamentSchema } from '@src/schema/tournament/getTournament.schema'
import { getTournamentDetailsSchema } from '@src/schema/tournament/getTournamentDetails.schema'
import { getTournamentLeaderBoardSchema } from '@src/schema/tournament/getTournamentLeaderBoard.schema'
import { getTournamentTransactionSchema } from '@src/schema/tournament/getTournamentTransaction.schema'
import { tournamentCancelSchema } from '@src/schema/tournament/tournamentCancel.schema'
import { tournamentSettlementSchema } from '@src/schema/tournament/tournamentSettlement.schema'
import express from 'express'

const supportedFileFormat = ['png', 'jpg', 'jpeg', 'tiff', 'svg+xml', 'webp', 'svg']
const tournamentRouter = express.Router({ mergeParams: true })

// GET
tournamentRouter.get('', TournamentController.getAllTournaments, responseValidationMiddleware(getTournamentSchema))
tournamentRouter.get('/details', isAuthenticated(), TournamentController.getTournamentsDetail, responseValidationMiddleware(getTournamentDetailsSchema))
tournamentRouter.get('/tournament-transactions', isAuthenticated(), TournamentController.getTournamentTransactions, responseValidationMiddleware(getTournamentTransactionSchema))
tournamentRouter.get('/tournament-leaderBoard', isAuthenticated(), TournamentController.getTournamentLeaderBoards, responseValidationMiddleware(getTournamentLeaderBoardSchema))

// POST
tournamentRouter.post('/create', isAuthenticated(), fileUpload(supportedFileFormat).single('image'), databaseTransactionHandlerMiddleware, TournamentController.createTournament, responseValidationMiddleware(createTournamentSchema))
tournamentRouter.post('/update', isAuthenticated(), fileUpload(supportedFileFormat).single('image'), databaseTransactionHandlerMiddleware, TournamentController.updateTournament, responseValidationMiddleware(successSchema))
// tournamentRouter.post('/toggle', isAuthenticated(resources.tournamentManagement.toggle), TournamentController.toggleTournament, responseValidationMiddleware(successSchema))
tournamentRouter.post('/settlement', databaseTransactionHandlerMiddleware, TournamentController.tournamentSettlement, responseValidationMiddleware(tournamentSettlementSchema))
tournamentRouter.post('/cancel', isAuthenticated(), TournamentController.cancelTournament, responseValidationMiddleware(tournamentCancelSchema))

// DELETE
tournamentRouter.delete('/delete-games', isAuthenticated(), TournamentController.deleteTournamentGames, responseValidationMiddleware(successSchema))

export { tournamentRouter }
