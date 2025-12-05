import express from 'express'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { getJackpotSchema } from '@src/schema/jackpot/getAllJackpot.schema'
import { JackpotController } from '@src/rest-resources/controllers/jackpot.controller'
import { jackpotRnGSchema } from '@src/schema/jackpot/jackpotRnG.schema'
import { createJackpotSchema } from '@src/schema/jackpot/createJackpot.schema'
import { updateJackpotSchema } from '@src/schema/jackpot/updateJackpot.schema'
import { deleteJackpotSchema } from '@src/schema/jackpot/deleteJackpot.schema'
import { getJackpotGraphSchema } from '@src/schema/jackpot/getJackpotGraph.schema'
import { resources } from '@src/utils/constants/permission.constant'

const jackpotRouter = express.Router({ mergeParams: true })

/**
 *  NOTE: We need to add live-chat permission in permission  before using this routes
 */

// GET REQUESTS
jackpotRouter.get('/', requestValidationMiddleware(getJackpotSchema), isAuthenticated(resources.jackpot.read), JackpotController.getAllJackpot, responseValidationMiddleware({}))
jackpotRouter.get('/info', requestValidationMiddleware({}), isAuthenticated(resources.jackpot.read), JackpotController.getJackpotTabs, responseValidationMiddleware({}))
jackpotRouter.get('/current', requestValidationMiddleware({}), JackpotController.getCurrentJackpotInfo, responseValidationMiddleware({}))
jackpotRouter.get('/rng', requestValidationMiddleware(jackpotRnGSchema), JackpotController.generateRandomWinningData, responseValidationMiddleware({}))
jackpotRouter.get('/graph', requestValidationMiddleware(getJackpotGraphSchema), isAuthenticated(resources.jackpot.read), JackpotController.getJackpotGraph, responseValidationMiddleware({}))

// POST REQUESTS
jackpotRouter.post('/', requestValidationMiddleware(createJackpotSchema), isAuthenticated(resources.jackpot.create), databaseTransactionHandlerMiddleware, JackpotController.createJackpot, responseValidationMiddleware({}))

// PUT REQUESTS
jackpotRouter.put('/', requestValidationMiddleware(updateJackpotSchema), isAuthenticated(resources.jackpot.update), databaseTransactionHandlerMiddleware, JackpotController.updateJackpot, responseValidationMiddleware({}))

// DELETE REQUESTS
jackpotRouter.delete('/', requestValidationMiddleware(deleteJackpotSchema), isAuthenticated(resources.jackpot.delete), JackpotController.deleteJackpot, responseValidationMiddleware({}))

export { jackpotRouter }
