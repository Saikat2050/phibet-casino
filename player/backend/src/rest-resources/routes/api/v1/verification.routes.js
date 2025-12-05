import { VerificationController } from '@src/rest-resources/controllers/verification.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const phoneRouter = express.Router({ mergeParams: true })

// POST REQUEST
phoneRouter.post('/request-otp', isAuthenticated, databaseTransactionHandlerMiddleware, VerificationController.requestOtp, responseValidationMiddleware({}))
phoneRouter.post('/verify-otp', isAuthenticated, databaseTransactionHandlerMiddleware, VerificationController.verifyOtp, responseValidationMiddleware({}))
phoneRouter.post('/resend-otp', isAuthenticated, databaseTransactionHandlerMiddleware, VerificationController.resendOtp, responseValidationMiddleware({}))

export { phoneRouter }
