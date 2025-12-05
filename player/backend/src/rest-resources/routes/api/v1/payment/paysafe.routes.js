import express from 'express'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { PaysafePaymentController } from '@src/rest-resources/controllers/payment/paysafe.controller'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'

const paysafeRouter = express.Router({ mergeParams: true })

// Paysafe
paysafeRouter.get('/banks', isAuthenticated, PaysafePaymentController.bankDetails, responseValidationMiddleware({}))
paysafeRouter.post('/banks', isAuthenticated, PaysafePaymentController.paysafeBankRegistration, responseValidationMiddleware({}))

// Aprrovely

export { paysafeRouter }
