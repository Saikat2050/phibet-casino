import express from 'express'
import contextMiddleware from '../../../middlewares/context.middleware'
import BeterLiveCasinoController from '../../../controllers/beterLive.casino.controller'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'

const beterLiveCasinoRoutes = express.Router()

beterLiveCasinoRoutes
  .route('/sessionInfo')
  .post(
    contextMiddleware(false),
    requestValidationMiddleware(),
    BeterLiveCasinoController.sessionInfo,
    responseValidationMiddleware()
  )
beterLiveCasinoRoutes
  .route('/balance')
  .post(
    contextMiddleware(false),
    requestValidationMiddleware(),
    BeterLiveCasinoController.getBalance,
    responseValidationMiddleware()
  )

beterLiveCasinoRoutes
  .route('/bet')
  .post(
    contextMiddleware(false),
    requestValidationMiddleware(),
    BeterLiveCasinoController.betBeterCasino,
    responseValidationMiddleware()
  )

beterLiveCasinoRoutes
  .route('/cancel')
  .post(
    contextMiddleware(false),
    requestValidationMiddleware(),
    BeterLiveCasinoController.rollbackBetBeterLiveCasino,
    responseValidationMiddleware()
  )

beterLiveCasinoRoutes
  .route('/confirmGame')
  .post(
    contextMiddleware(false),
    requestValidationMiddleware(),
    BeterLiveCasinoController.winConfirmCasino,
    responseValidationMiddleware()
  )

// promotion win:
beterLiveCasinoRoutes
  .route('/promoWin')
  .post(
    contextMiddleware(true),
    requestValidationMiddleware(),
    BeterLiveCasinoController.promoWinBetBeterLiveCasino,
    responseValidationMiddleware()
  )

// Tips
// beterLiveCasinoRoutes
//   .route('/tips')
//   .post(
//     contextMiddleware(true),
//     requestValidationMiddleware(),
//     BeterLiveCasinoController.tipsBetBeterLiveCasino,
//     responseValidationMiddleware()
//   )

// // cancel-Tips
// beterLiveCasinoRoutes
//   .route('/cancelTips')
//   .post(
//     contextMiddleware(true),
//     requestValidationMiddleware(),
//     BeterLiveCasinoController.cancelTipsBetBeterLiveCasino,
//     responseValidationMiddleware()
//   )

export default beterLiveCasinoRoutes
