import { CredentialsController } from '@src/rest-resources/controllers/internal.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const supportedFileFormat = ['png', 'jpg', 'jpeg', 'tiff', 'svg+xml', 'webp', 'svg']
const internalRouter = express.Router({ mergeParams: true })

// GET REQUESTS
internalRouter.get('/credentials', isAuthenticated(), CredentialsController.getCredentials, responseValidationMiddleware({}))

// POST REQUESTS
internalRouter.post('/create-credentials', isAuthenticated(), databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormat).single('icon'), CredentialsController.createCredentials, responseValidationMiddleware({}))
internalRouter.post('/update-credentials', isAuthenticated(), databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormat).single('icon'), CredentialsController.updateCredentials, responseValidationMiddleware({}))

// reset super admin permissions
internalRouter.put('/super-admin', isAuthenticated(), CredentialsController.resetSuperAdmin, responseValidationMiddleware({}))

export { internalRouter }
