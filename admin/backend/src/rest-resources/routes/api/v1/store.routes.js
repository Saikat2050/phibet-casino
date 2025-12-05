import { StoreController } from '@src/rest-resources/controllers/store.controlller'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { resources } from '@src/utils/constants/permission.constant'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { successSchema } from '@src/schema/successResponse.schema'

const storeRouter = express.Router({ mergeParams: true })

// GET
storeRouter.get('/package', isAuthenticated(resources.package.read), StoreController.getPackage, responseValidationMiddleware({}))
storeRouter.get('/packages', isAuthenticated(resources.package.read), StoreController.getPackages, responseValidationMiddleware({}))

// POST
storeRouter.post('/create-package', requestValidationMiddleware({}), isAuthenticated(resources.package.create), databaseTransactionHandlerMiddleware, StoreController.createPackage, responseValidationMiddleware({}))
storeRouter.post('/update-package', requestValidationMiddleware({}), isAuthenticated(resources.package.update), databaseTransactionHandlerMiddleware, StoreController.updatePackage, responseValidationMiddleware({}))
storeRouter.post('/reorder-package', requestValidationMiddleware({}), isAuthenticated(resources.package.update), databaseTransactionHandlerMiddleware, StoreController.reorderPackage, responseValidationMiddleware({}))

// DELETE
storeRouter.delete('/delete-package', isAuthenticated(resources.package.delete), StoreController.deletePackage, responseValidationMiddleware(successSchema))
export { storeRouter }
