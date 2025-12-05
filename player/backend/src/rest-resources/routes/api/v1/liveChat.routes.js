import { LiveChatController } from '@src/rest-resources/controllers/liveChat.controller'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { getChatGroupSchema } from '@src/schema/liveChat/chatGroup/getChatGroup.schema'
import { getGroupChatSchema } from '@src/schema/liveChat/chatGroup/getGroupChat.schema'
import { joinChatGroupSchema } from '@src/schema/liveChat/chatGroup/joinChatGroup.schema'
import { claimChatRainSchema } from '@src/schema/liveChat/chatRain/claimChatRain.schema'
import { getChatRainSchema } from '@src/schema/liveChat/chatRain/getChatRain.schema'
import { isSemiAuthenticated } from '@src/rest-resources/middlewares/isSemiAuthenticated'
import express from 'express'
import { successSchema } from '@src/schema/common'

const liveChatRoutes = express.Router({ mergeParams: true })

// GET REQUESTS
liveChatRoutes.get('/chat-group', isSemiAuthenticated, requestValidationMiddleware(getChatGroupSchema), LiveChatController.getChatGroup, responseValidationMiddleware(getChatGroupSchema))
liveChatRoutes.get('/get-chat-rain', requestValidationMiddleware(getChatRainSchema), LiveChatController.getChatRain, responseValidationMiddleware(getChatRainSchema))
liveChatRoutes.get('/get-chat', isSemiAuthenticated, requestValidationMiddleware(getGroupChatSchema), LiveChatController.getUserChat, responseValidationMiddleware(getGroupChatSchema))

// POST REQUESTS
liveChatRoutes.post('/join-chat-group', isAuthenticated, requestValidationMiddleware(joinChatGroupSchema), LiveChatController.joinChatGroup, responseValidationMiddleware(successSchema))
liveChatRoutes.post('/send-message', isAuthenticated, LiveChatController.sendMessage, responseValidationMiddleware(successSchema))
liveChatRoutes.post('/send-tip', requestValidationMiddleware({}), isAuthenticated, LiveChatController.sendTip, responseValidationMiddleware({}))
liveChatRoutes.post('/claim-chat-rain', isAuthenticated, requestValidationMiddleware(claimChatRainSchema), LiveChatController.claimChatRain, responseValidationMiddleware(claimChatRainSchema))

export { liveChatRoutes }
