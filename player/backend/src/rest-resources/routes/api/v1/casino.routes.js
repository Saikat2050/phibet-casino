import { CasinoController } from '@src/rest-resources/controllers/casino.controller'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { isSemiAuthenticated } from '@src/rest-resources/middlewares/isSemiAuthenticated'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { initGameSchema } from '@src/schema/casino/initGame.schema'
import express from 'express'

const casinoRouter = express.Router({ mergeParams: true })

// GET REQUESTS
casinoRouter.get('/games', isSemiAuthenticated, CasinoController.getAllGames, responseValidationMiddleware({}))
casinoRouter.get('/providers', CasinoController.getGameProvider, responseValidationMiddleware({}))
casinoRouter.get('/category-games', CasinoController.getCategorygames, responseValidationMiddleware({}))
casinoRouter.get('/categories', CasinoController.getGameCategory, responseValidationMiddleware({}))
casinoRouter.get('/favorite-games', isAuthenticated, CasinoController.getFavoriteGame, responseValidationMiddleware({}))
casinoRouter.get('/transactions', isAuthenticated, CasinoController.getCasinoTransactions, responseValidationMiddleware({}))

// POST REQUESTS
casinoRouter.post('/toggle-favorite-game', isAuthenticated, CasinoController.toggleFavoriteGame, responseValidationMiddleware({}))
casinoRouter.post('/init-game', requestValidationMiddleware(initGameSchema), isAuthenticated, CasinoController.initGame, responseValidationMiddleware(initGameSchema))
casinoRouter.post('/init-demo', CasinoController.demoGame, responseValidationMiddleware({}))

export { casinoRouter }
