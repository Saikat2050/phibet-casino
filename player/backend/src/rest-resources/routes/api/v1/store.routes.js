import { StoreController } from '@src/rest-resources/controllers/store.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const storeRouter = express.Router({ mergeParams: true })

// GET
storeRouter.get('/packages', isAuthenticated, requestValidationMiddleware({}), StoreController.getPackages, responseValidationMiddleware({}))
storeRouter.get('/purchase-detail', isAuthenticated, StoreController.getTransactionDetail, responseValidationMiddleware({}))

// POST
storeRouter.post('/package/purchase', isAuthenticated, requestValidationMiddleware({}), databaseTransactionHandlerMiddleware, StoreController.puchasePackage, responseValidationMiddleware({}))
storeRouter.post('/redeem', isAuthenticated, requestValidationMiddleware({}), databaseTransactionHandlerMiddleware, StoreController.redeemCoins, responseValidationMiddleware({}))

export { storeRouter }
