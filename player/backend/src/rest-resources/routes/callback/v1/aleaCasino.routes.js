import { AleaCasinoController } from '@src/rest-resources/controllers/alea.casino.controller'
import { aleaDatabaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/aleaDatabaseTransactionHandler.middleware'
import express from 'express'

const aleaRouter = express.Router()

// POST REQUESTS
aleaRouter.get('/sessions/:casinoSessionId', AleaCasinoController.aleaSessionCallback)
aleaRouter.get('/players/:userId/balance', AleaCasinoController.aleaBalanceCallback)
aleaRouter.post('/transactions', aleaDatabaseTransactionHandlerMiddleware, AleaCasinoController.aleaCallbacks)
export { aleaRouter }
