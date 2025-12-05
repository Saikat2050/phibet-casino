import express from 'express'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import TinyrexCasinoController from '../../../controllers/tinyrex.casino.controller'
import tinyrexAuthMiddleware from '../../../middlewares/validation/tinyrex.middleware'

const tinyrexRoutes = express.Router()

tinyrexRoutes
  .route('/balance')
  .post(
    contextMiddleware(false),
    requestValidationMiddleware(),
    tinyrexAuthMiddleware(),
    TinyrexCasinoController.getBalance,
    responseValidationMiddleware()
  )

tinyrexRoutes
  .route('/bet')
  .post(
    contextMiddleware(true),
    requestValidationMiddleware(),
    tinyrexAuthMiddleware(),
    TinyrexCasinoController.betBeterCasino,
    responseValidationMiddleware()
  )

tinyrexRoutes
  .route('/rollback')
  .post(
    contextMiddleware(true),
    requestValidationMiddleware(),
    tinyrexAuthMiddleware(),
    TinyrexCasinoController.rollbackBetBeterLiveCasino,
    responseValidationMiddleware()
  )

tinyrexRoutes
  .route('/win')
  .post(
    contextMiddleware(true),
    requestValidationMiddleware(),
    tinyrexAuthMiddleware(),
    TinyrexCasinoController.winConfirmCasino,
    responseValidationMiddleware()
  )


export default tinyrexRoutes
