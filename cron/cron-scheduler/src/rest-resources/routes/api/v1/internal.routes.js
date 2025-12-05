import { InternalController } from '@src/rest-resources/controllers/internal.controller'
import { isBasicAuthenticatedMiddleware } from '@src/rest-resources/middlewares/isBasicAuthenticated.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const internalRouter = express.Router({ mergeParams: true })

internalRouter.post('/withdrawl/pay-by-bank', isBasicAuthenticatedMiddleware, InternalController.addWithdrawlRequestJobs, responseValidationMiddleware({}))

internalRouter.post('/games/alea', isBasicAuthenticatedMiddleware, InternalController.addAleaGameSeedingJobs, responseValidationMiddleware({}))

internalRouter.post('/games/iconic21', isBasicAuthenticatedMiddleware, InternalController.addIconic21GameSeedingJobs, responseValidationMiddleware({}))

export { internalRouter }
