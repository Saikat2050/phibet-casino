import { TransactionController } from '@src/rest-resources/controllers/transaction.controller'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { resources } from '@src/utils/constants/permission.constant'

const transactioRouter = express.Router({ mergeParams: true })

// GET REQUESTS
transactioRouter.get('/casino-transactions', isAuthenticated(resources.reportCasinoTransaction.read), TransactionController.getCasinoTransactions, responseValidationMiddleware({}))
transactioRouter.get('/banking-transactions', isAuthenticated(resources.reportTransaction.read), TransactionController.getBankingTransactions, responseValidationMiddleware({}))
transactioRouter.get('/ledgers', isAuthenticated(resources.reportLedger.read), TransactionController.getLedgers, responseValidationMiddleware({}))

export { transactioRouter }
