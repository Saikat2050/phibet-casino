import { AmoeController } from '@src/rest-resources/controllers/amoe.controller'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const amoeRouter = express.Router({ mergeParams: true })

// GET
amoeRouter.get('/generate-postal-code', isAuthenticated, requestValidationMiddleware({}), AmoeController.generatePostalCode, responseValidationMiddleware({}))
amoeRouter.get('/requests', isAuthenticated, requestValidationMiddleware({}), AmoeController.getAllEmoEntry, responseValidationMiddleware({}))

export { amoeRouter }
