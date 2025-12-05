import express from 'express'
import contextMiddleware from '../../../middlewares/context.middleware'
import AleaCasinoController from '../../../controllers/alea.casino.controller'
import GSoftCasinoController from '../../../controllers/gsoft.casino.controller'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import beterLiveCasinoRoutes from './beterLive.casino.routes'
import boomingRoutes from './booming.routes'
import tinyrexRoutes from './tinyrex.routes'

const casinoRoutes = express.Router()

casinoRoutes
  .route('/GSoft')
  .get(
    contextMiddleware(true),
    requestValidationMiddleware(),
    GSoftCasinoController.gSoftCallbacks,
    responseValidationMiddleware()
  )

casinoRoutes
  .route('/alea/transactions')
  .post(
    contextMiddleware(true),
    requestValidationMiddleware(),
    AleaCasinoController.aleaCallbacks,
    responseValidationMiddleware()
  )

casinoRoutes
  .route('/alea/players/:userId/balance')
  .get(
    contextMiddleware(false),
    requestValidationMiddleware(),
    AleaCasinoController.aleaBalanceCallback,
    responseValidationMiddleware()
  )

casinoRoutes
  .route('/alea/sessions/:casinoSessionId')
  .get(
    contextMiddleware(false),
    requestValidationMiddleware(),
    AleaCasinoController.aleaSessionCallback,
    responseValidationMiddleware()
  )

casinoRoutes.use('/beter-live/sw/v2', beterLiveCasinoRoutes)
casinoRoutes.use('/booming', boomingRoutes)
casinoRoutes.use('/tinyrex', tinyrexRoutes)

export default casinoRoutes
