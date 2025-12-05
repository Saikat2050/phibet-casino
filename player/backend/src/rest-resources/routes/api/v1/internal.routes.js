import { InternalController } from '@src/rest-resources/controllers/internal.controller'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { isBasicAuthenticatedMiddleware } from '@src/rest-resources/middlewares/isBasicAuthenticated.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const internalRouter = express.Router({ mergeParams: true })

// POST REQUESTS CreateTransactionService
internalRouter.post('/password', isAuthenticated, InternalController.updatePassword, responseValidationMiddleware({}))
internalRouter.post('/send-reset-password-email', isBasicAuthenticatedMiddleware, InternalController.sendResetPasswordEmail, responseValidationMiddleware({}))
internalRouter.post('/create-tx', InternalController.createTxn, responseValidationMiddleware({}))

export { internalRouter }
