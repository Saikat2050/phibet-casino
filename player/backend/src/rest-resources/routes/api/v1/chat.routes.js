import { LiveChatController } from "@src/rest-resources/controllers/liveChat.controller";
import { isAuthenticated } from "@src/rest-resources/middlewares/isAuthenticated";
import { requestValidationMiddleware } from "@src/rest-resources/middlewares/requestValidation.middleware";
import { responseValidationMiddleware } from "@src/rest-resources/middlewares/responseValidation.middleware";
import { getChatGroupSchema } from "@src/schema/liveChat/chatGroup/getChatGroup.schema";
import { getGroupChatSchema } from "@src/schema/liveChat/chatGroup/getGroupChat.schema";
import { joinChatGroupSchema } from "@src/schema/liveChat/chatGroup/joinChatGroup.schema";
import { claimChatRainSchema } from "@src/schema/liveChat/chatRain/claimChatRain.schema";
import { getChatRainSchema } from "@src/schema/liveChat/chatRain/getChatRain.schema";
import { isSemiAuthenticated } from "@src/rest-resources/middlewares/isSemiAuthenticated";
import express from "express";
import { successSchema } from "@src/schema/common";
import { ChatController } from "@src/rest-resources/controllers/chat.controller";

const chatRoutes = express.Router({ mergeParams: true });

// GET REQUESTS
chatRoutes.get(
  "/chat-group",
  requestValidationMiddleware({}),
  ChatController.fetchChatGroup,
  responseValidationMiddleware({})
);
chatRoutes.get(
  "/chat",
  requestValidationMiddleware({}),
  ChatController.fetchChatDetails,
  responseValidationMiddleware({})
);

// POST REQUESTS
chatRoutes.post(
  "/chat-group",
  isAuthenticated,
  requestValidationMiddleware({}),
  ChatController.createChatGroup,
  responseValidationMiddleware({})
);
chatRoutes.post(
  "/chat",
  isAuthenticated,
  requestValidationMiddleware({}),
  ChatController.createChatDetails,
  responseValidationMiddleware({})
);

export { chatRoutes };
