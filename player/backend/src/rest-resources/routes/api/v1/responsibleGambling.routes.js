import { ResponsibleGamblingController } from '@src/rest-resources/controllers/responsibleGambling.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { successSchema } from '@src/schema/common'
import { getLimitsSchema, updateSelfExclusionSchema } from '@src/schema/responsibleGambling'
import express from 'express'

const responsibleGamblingRouter = express.Router({ mergeParams: true })

// GET REQUESTS
responsibleGamblingRouter.get('/get-limits', isAuthenticated, ResponsibleGamblingController.getLimits, responseValidationMiddleware(getLimitsSchema))

// POST REQUESTS
// responsibleGamblingRouter.post('/update-limit', isAuthenticated, requestValidationMiddleware(updateLimitsSchema), databaseTransactionHandlerMiddleware, ResponsibleGamblingController.updateLimit, responseValidationMiddleware(successSchema))
responsibleGamblingRouter.put('/self-exclusion', isAuthenticated, requestValidationMiddleware(updateSelfExclusionSchema), databaseTransactionHandlerMiddleware, ResponsibleGamblingController.updateSelfExclusion, responseValidationMiddleware(successSchema))
responsibleGamblingRouter.post('/update-loss-limit', isAuthenticated, databaseTransactionHandlerMiddleware, ResponsibleGamblingController.updateLossLimit, responseValidationMiddleware(successSchema))
responsibleGamblingRouter.post('/update-bet-limit', isAuthenticated, databaseTransactionHandlerMiddleware, ResponsibleGamblingController.updateBetLimit, responseValidationMiddleware(successSchema))
responsibleGamblingRouter.post('/update-deposit-limit', isAuthenticated, databaseTransactionHandlerMiddleware, ResponsibleGamblingController.updateDepositLimit, responseValidationMiddleware(successSchema))

export { responsibleGamblingRouter }
