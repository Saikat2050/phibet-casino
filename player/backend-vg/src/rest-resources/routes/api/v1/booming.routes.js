import express from 'express'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import BoomingCasinoController from '../../../controllers/booming.casino.controller'
import boomingAuthMiddleware from '../../../middlewares/booming.middleware'

const boomingRoutes = express.Router()

boomingRoutes
  .route('/betWinLose')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    boomingAuthMiddleware,
    BoomingCasinoController.betWinCallback,
    responseValidationMiddleware({})
  )

boomingRoutes
  .route('/betWinLoseRollbackCallback')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    boomingAuthMiddleware,
    BoomingCasinoController.rollbackCallback,
    responseValidationMiddleware({})
  )

export default boomingRoutes
