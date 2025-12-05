import { VaultController } from '@src/rest-resources/controllers/vault.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { successSchema } from '@src/schema/common'
import express from 'express'

const vaultRouter = express.Router({ mergeParams: true })

// POST REQUEST
vaultRouter.post('/', isAuthenticated, databaseTransactionHandlerMiddleware, VaultController.vault, responseValidationMiddleware(successSchema))

export { vaultRouter }
