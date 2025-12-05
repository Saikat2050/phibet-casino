import { SpinWheelController } from '@src/rest-resources/controllers/spinWheel.controller'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const spinWheelRouter = express.Router({ mergeParams: true })

// GET REQUESTS
spinWheelRouter.get('/', SpinWheelController.getSpinWheelList, responseValidationMiddleware({}))
spinWheelRouter.post('/generate-index', isAuthenticated, SpinWheelController.generateSpinWheelIndex, responseValidationMiddleware({}))

export { spinWheelRouter }
