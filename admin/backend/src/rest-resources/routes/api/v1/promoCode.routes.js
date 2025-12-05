import { PromoCodeController } from '@src/rest-resources/controllers/promoCode.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const promoCodeRouter = express.Router({ mergeParams: true })

promoCodeRouter.post('/create-promocode', isAuthenticated(),
  databaseTransactionHandlerMiddleware,
  PromoCodeController.createPromoCodes,
  responseValidationMiddleware({}))
promoCodeRouter.delete('/delete-promocode',
  isAuthenticated(),
  databaseTransactionHandlerMiddleware,
  PromoCodeController.deletePromoCode,
  responseValidationMiddleware({}))
promoCodeRouter.get('/get-promocode',
  isAuthenticated(),
  PromoCodeController.getPromoCodeDetails,
  responseValidationMiddleware({}))
promoCodeRouter.put('/update-promocode',
  isAuthenticated(),
  databaseTransactionHandlerMiddleware,
  PromoCodeController.updatePromoCodes,
  responseValidationMiddleware({}))
promoCodeRouter.get('/promocode-applied-history',
  isAuthenticated(),
  PromoCodeController.promoCodeAppliedDetails,
  responseValidationMiddleware({}))
export { promoCodeRouter }
