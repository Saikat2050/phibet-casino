import { ApprovelyController } from '@src/rest-resources/controllers/payment/approvely.controller'
import { PaysafePaymentController } from '@src/rest-resources/controllers/payment/paysafe.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const paymentRouter = express.Router()

// POST REQUESTS
paymentRouter.post('/paysafe/transaction', databaseTransactionHandlerMiddleware, PaysafePaymentController.paysafeWebhook, responseValidationMiddleware({}))
paymentRouter.post('/approvely/transaction', databaseTransactionHandlerMiddleware, ApprovelyController.transactionCallback, responseValidationMiddleware({}))

export { paymentRouter }
