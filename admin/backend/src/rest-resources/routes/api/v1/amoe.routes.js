import { AmoeController } from '@src/rest-resources/controllers/amoe.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { resources } from '@src/utils/constants/permission.constant'
import express from 'express'

const amoeRouter = express.Router({ mergeParams: true })

// GET
amoeRouter.get('/requests', isAuthenticated(resources.amoe.read), AmoeController.getAllAmoEnties, responseValidationMiddleware({}))

// POST
amoeRouter.post('/manage', isAuthenticated(resources.amoe.update), databaseTransactionHandlerMiddleware, AmoeController.manageAmoEntries, responseValidationMiddleware({}))

// PUT
amoeRouter.put('/address', isAuthenticated(resources.amoe.update), databaseTransactionHandlerMiddleware, AmoeController.updateAmoeAddress, responseValidationMiddleware({}))

export { amoeRouter }
