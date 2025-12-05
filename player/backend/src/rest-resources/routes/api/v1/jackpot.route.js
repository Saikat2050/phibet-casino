
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'
import { jackpotController } from '@src/rest-resources/controllers/jackpot.controller'

const jackpotRouter = express.Router({ mergeParams: true })

// GET REQUESTS
jackpotRouter.get('/', isAuthenticated, requestValidationMiddleware({}), jackpotController.getJackpotDetail, responseValidationMiddleware({}))

// POST REQUESTS
jackpotRouter.post('/', isAuthenticated, requestValidationMiddleware({}), jackpotController.updateJackpotPreference, responseValidationMiddleware({}))
export { jackpotRouter }
