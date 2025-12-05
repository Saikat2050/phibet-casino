import { Iconic21CasinoController } from '@src/rest-resources/controllers/iconic21.casino.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import express from 'express'

const iconic21Router = express.Router()

iconic21Router.post('/sessionInfo', Iconic21CasinoController.sessionInfoIconic21Casino)
iconic21Router.post('/balance', databaseTransactionHandlerMiddleware, Iconic21CasinoController.getBalanceIconic21Casino)
iconic21Router.post('/bet', databaseTransactionHandlerMiddleware, Iconic21CasinoController.betIconic21Casino)
iconic21Router.post('/confirmGame', databaseTransactionHandlerMiddleware, Iconic21CasinoController.winIconic21Casino)
iconic21Router.post('/cancel', databaseTransactionHandlerMiddleware, Iconic21CasinoController.rollbackIconic21Casino)

export { iconic21Router }
