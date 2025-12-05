import express from 'express'
import TournamentController from '../../../controllers/tournament.controller'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import { isUserAuthenticated } from '../../../middlewares/isUserAuthenticated.middleware'
import contextMiddleware from '../../../middlewares/context.middleware'
import { joinTournamentSchemas, defaultResponseSchemas } from '../../../middlewares/validation/schema.validate'

const args = { mergeParams: true }
const tournamentRouter = express.Router(args)

tournamentRouter
  .route('/')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    TournamentController.getAllTournament,
    responseValidationMiddleware()
  )
  .post(
    requestValidationMiddleware(joinTournamentSchemas),
    contextMiddleware(true),
    isUserAuthenticated,
    TournamentController.joinTournament,
    responseValidationMiddleware(defaultResponseSchemas)
  )

tournamentRouter
  .route('/:tournamentId')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    TournamentController.getTournamentDetails,
    responseValidationMiddleware()
  )

tournamentRouter.route('/join')

export default tournamentRouter
