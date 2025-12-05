import express from 'express'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { BlockedUserController } from '@src/rest-resources/controllers/blockedUser.controller'
import { getReportedUserSchema } from '@src/schema/liveChat/bolckedUser/getBlockedUser.schema'
import { unblockReportedUserSchema } from '@src/schema/liveChat/bolckedUser/unblockUser.schema'
import { blockReportedUserSchema } from '@src/schema/liveChat/bolckedUser/blockUser.schema'

const reportedUserRoutes = express.Router({ mergeParams: true })

reportedUserRoutes
  .get(
    '/get',
    isAuthenticated,
    requestValidationMiddleware(getReportedUserSchema),
    BlockedUserController.getBlockedUser,
    responseValidationMiddleware(getReportedUserSchema)
  )

reportedUserRoutes
  .post(
    '/block',
    isAuthenticated,
    requestValidationMiddleware(blockReportedUserSchema),
    BlockedUserController.blockUser,
    responseValidationMiddleware(blockReportedUserSchema)
  )

reportedUserRoutes
  .post(
    '/unblock',
    isAuthenticated,
    requestValidationMiddleware(unblockReportedUserSchema),
    BlockedUserController.unblockUser,
    responseValidationMiddleware(unblockReportedUserSchema)
  )

export { reportedUserRoutes }
