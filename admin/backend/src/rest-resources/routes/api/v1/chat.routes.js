import { ChatController } from '@src/rest-resources/controllers/chat.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const chatRouter = express.Router({ mergeParams: true })

/**
 *  NOTE: We need to add chat permission in permission  before using this routes
 */

// GET REQUESTS
chatRouter.get('/settings', requestValidationMiddleware({}), ChatController.fetchGlobalChatSettings, responseValidationMiddleware({}))
chatRouter.get('/group', requestValidationMiddleware({}), ChatController.fetchChatGroup, responseValidationMiddleware({}))
chatRouter.get('/chat-details', requestValidationMiddleware({}), ChatController.fetchChatDetails, responseValidationMiddleware({}))
chatRouter.get('/offensive-words', requestValidationMiddleware({}), ChatController.fetchOffensiveWords, responseValidationMiddleware({}))

// POST REQUESTS
chatRouter.post('/modify-settings', requestValidationMiddleware({}), isAuthenticated(), databaseTransactionHandlerMiddleware, ChatController.updateGlobalChatSettings, responseValidationMiddleware({}))
chatRouter.post('/group', requestValidationMiddleware({}), isAuthenticated(), databaseTransactionHandlerMiddleware, ChatController.createChatGroup, responseValidationMiddleware({}))
chatRouter.post('/offensive-words', requestValidationMiddleware({}), isAuthenticated(), databaseTransactionHandlerMiddleware, ChatController.createOffensiveWord, responseValidationMiddleware({}))

// PUT REQUESTS
chatRouter.put('/group', requestValidationMiddleware({}), isAuthenticated(), databaseTransactionHandlerMiddleware, ChatController.updateChatGroup, responseValidationMiddleware({}))

// DELETE REQUESTS
chatRouter.delete('/group', requestValidationMiddleware({}), isAuthenticated(), databaseTransactionHandlerMiddleware, ChatController.deleteChatGroup, responseValidationMiddleware({}))
chatRouter.delete('/offensive-words', requestValidationMiddleware({}), isAuthenticated(), databaseTransactionHandlerMiddleware, ChatController.deleteOffensiveWord, responseValidationMiddleware({}))

export { chatRouter }
