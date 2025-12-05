import express from 'express'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { LiveChatController } from '@src/rest-resources/controllers/liveChat.controller'
import { createChatRainSchema } from '@src/schema/chatModule/chatRain/createChatRain.schema'
import { updateChatRainSchema } from '@src/schema/chatModule/chatRain/updateChatRain.schema'
import { getChatRainSchema } from '@src/schema/chatModule/chatRain/getChatRain.schema'
import { createOffensiveWordSchema } from '@src/schema/chatModule/offensiveWords/createOffensiveWord.schema'
import { getOffensiveWordsSchema } from '@src/schema/chatModule/offensiveWords/getOffenesiveWord.schema'
import { deleteOffensiveWordsSchema } from '@src/schema/chatModule/offensiveWords/deleteOffensiveWord.schema'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { createChatGroupSchema, updateChatGroupSchema } from '@src/schema/chatModule/chatGroup'
import { getChatGroupSchema } from '@src/schema/chatModule/chatGroup/getChatGroups.schema'
import { successSchema } from '@src/schema/successResponse.schema'

const liveChatRouter = express.Router({ mergeParams: true })

/**
 *  NOTE: We need to add live-chat permission in permission  before using this routes
 */

// GET REQUESTS
liveChatRouter.get('/offensive-words', requestValidationMiddleware(getOffensiveWordsSchema), isAuthenticated(), LiveChatController.getOffensiveWords, responseValidationMiddleware(getOffensiveWordsSchema))
liveChatRouter.get('/chat-rain', requestValidationMiddleware(getChatRainSchema), isAuthenticated(), LiveChatController.getChatRain, responseValidationMiddleware(getChatRainSchema))
liveChatRouter.get('/groups', requestValidationMiddleware(getChatGroupSchema), LiveChatController.getChatGroup, responseValidationMiddleware(getChatGroupSchema))

// POST REQUESTS
liveChatRouter.post('/offensive-word', requestValidationMiddleware(createOffensiveWordSchema), isAuthenticated(), databaseTransactionHandlerMiddleware, LiveChatController.createOffensiveWord, responseValidationMiddleware(createOffensiveWordSchema))
liveChatRouter.post('/chat-rain', requestValidationMiddleware(createChatRainSchema), isAuthenticated(), databaseTransactionHandlerMiddleware, LiveChatController.createChatRain, responseValidationMiddleware(createChatRainSchema))
liveChatRouter.post('/group', requestValidationMiddleware(createChatGroupSchema), isAuthenticated(), databaseTransactionHandlerMiddleware, LiveChatController.createChatGroup, responseValidationMiddleware(createChatRainSchema))

// PUT REQUESTS
liveChatRouter.put('/chat-rain', requestValidationMiddleware(updateChatRainSchema), isAuthenticated(), databaseTransactionHandlerMiddleware, LiveChatController.updateChatRain, responseValidationMiddleware(updateChatRainSchema))
liveChatRouter.put('/group', requestValidationMiddleware(updateChatGroupSchema), isAuthenticated(), databaseTransactionHandlerMiddleware, LiveChatController.updateChatGroup, responseValidationMiddleware(successSchema))

// DELETE REQUESTS
liveChatRouter.delete('/offensive-word', requestValidationMiddleware(deleteOffensiveWordsSchema), isAuthenticated(), LiveChatController.deleteOffensiveWord, responseValidationMiddleware(deleteOffensiveWordsSchema))

export { liveChatRouter }
