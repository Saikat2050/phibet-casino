import { KycController } from '@src/rest-resources/controllers/playerManagement/kyc.controller'
import { LimitController } from '@src/rest-resources/controllers/playerManagement/limit.controller'
import { PlayerController } from '@src/rest-resources/controllers/playerManagement/player.controller'
import { SegmentController } from '@src/rest-resources/controllers/playerManagement/segmentation.controller'
import { TagController } from '@src/rest-resources/controllers/playerManagement/tag.controller'
import { WheelDivisionConfigController } from '@src/rest-resources/controllers/playerManagement/wheelDivision.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { getDuplicatePlayerSchema } from '@src/schema/playerManagement/duplicatePlayer.schema'
import { getPlayerSchema } from '@src/schema/playerManagement/getPlayer.schema'
import { getPlayersSchema } from '@src/schema/playerManagement/getPlayers.schema'
import { manageWalletSchema } from '@src/schema/playerManagement/manageWallet.schema'
import { createSegmentSchema } from '@src/schema/playerManagement/segmentation/createSegment.schema'
import { deleteSegmentSchema } from '@src/schema/playerManagement/segmentation/deleteSegment.schema'
import { updateSegmentSchema } from '@src/schema/playerManagement/segmentation/updateSegment.schema'
import { selfExclusionSchema } from '@src/schema/playerManagement/selfExclusion.schema'
import { attachTagSchema } from '@src/schema/playerManagement/tag/attachtag.schema'
import { createTagSchema } from '@src/schema/playerManagement/tag/createTag.schema'
import { getTagsSchema } from '@src/schema/playerManagement/tag/getTag.schema'
import { successSchema } from '@src/schema/successResponse.schema'
import { resources } from '@src/utils/constants/permission.constant'

import express from 'express'

const playerManagementRouter = express.Router()

// GET REQUESTS
playerManagementRouter.get('/player', isAuthenticated(resources.player.read), PlayerController.getPlayer, responseValidationMiddleware(getPlayerSchema))
playerManagementRouter.get('/players', isAuthenticated(resources.player.read), PlayerController.getPlayers, responseValidationMiddleware(getPlayersSchema))
playerManagementRouter.get('/duplicate-players', isAuthenticated(resources.player.read), PlayerController.getDuplicatePlayers, responseValidationMiddleware(getDuplicatePlayerSchema))
playerManagementRouter.get('/spin-wheel/config', isAuthenticated(resources.spinWheelConfiguration.read), WheelDivisionConfigController.getSpinWheelConfig, responseValidationMiddleware({}))
playerManagementRouter.get('/tags', isAuthenticated(resources.segmentation.read), TagController.getTags, responseValidationMiddleware(getTagsSchema))
playerManagementRouter.get('/segments', isAuthenticated(resources.segmentation.read), SegmentController.getSegments, responseValidationMiddleware({}))
playerManagementRouter.get('/segment-constant', isAuthenticated(resources.segmentation.read), SegmentController.getSegmentConstants, responseValidationMiddleware({}))
playerManagementRouter.get('/segment-users', isAuthenticated(resources.segmentation.read), SegmentController.getSegmentationUsers, responseValidationMiddleware({}))
playerManagementRouter.get('/player/comments', isAuthenticated(resources.player.read), PlayerController.getPlayerComments, responseValidationMiddleware({}))

// POST REQUESTS
playerManagementRouter.post('/wallet', isAuthenticated(), databaseTransactionHandlerMiddleware, PlayerController.manageUserWallet, responseValidationMiddleware(manageWalletSchema))
playerManagementRouter.post('/limit/update-self-exclusion', isAuthenticated(resources.player.update), databaseTransactionHandlerMiddleware, LimitController.updateSelfExclusion, responseValidationMiddleware(selfExclusionSchema))
playerManagementRouter.post('/limit/update-loss-limit', isAuthenticated(resources.player.update), databaseTransactionHandlerMiddleware, LimitController.updateLossLimit, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/limit/update-deposit-limit', isAuthenticated(resources.player.update), databaseTransactionHandlerMiddleware, LimitController.updateDepositLimit, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/limit/update-bet-limit', isAuthenticated(resources.player.update), databaseTransactionHandlerMiddleware, LimitController.updateBetLimit, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/kyc/verify-email', isAuthenticated(resources.player.verify_email), databaseTransactionHandlerMiddleware, KycController.verifyEmail, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/kyc/verify-phone', isAuthenticated(resources.player.verify_phone), databaseTransactionHandlerMiddleware, KycController.verifyPhone, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/player/toggle', isAuthenticated(resources.player.toggle_status), PlayerController.togglePlayer, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/player/update', isAuthenticated(), databaseTransactionHandlerMiddleware, PlayerController.updatePlayer, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/player/update-password', isAuthenticated(resources.player.update), databaseTransactionHandlerMiddleware, PlayerController.updatePlayerPassword, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/player/reset-password', isAuthenticated(resources.player.reset_password), PlayerController.resetPlayerPassword, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/player/create-comment', isAuthenticated(), PlayerController.createComment, responseValidationMiddleware({}))
playerManagementRouter.post('/tag/create', isAuthenticated(resources.segmentation.create), TagController.createTag, responseValidationMiddleware(createTagSchema))
playerManagementRouter.post('/tag/attach-tag', isAuthenticated(resources.segmentation.issue), TagController.attachTagToPlayer, responseValidationMiddleware(attachTagSchema))
playerManagementRouter.post('/tag/remove-tag', isAuthenticated(resources.segmentation.delete), TagController.removeTagFromPlayer, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/tag/update-tag', isAuthenticated(resources.segmentation.update), TagController.updateTag, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/segment', isAuthenticated(resources.segmentation.create), requestValidationMiddleware(createSegmentSchema), databaseTransactionHandlerMiddleware, SegmentController.createSegment, responseValidationMiddleware(createSegmentSchema))
playerManagementRouter.post('/segment-advance-filter', isAuthenticated(resources.segmentation.read), SegmentController.segmentationAdvancedFilter, responseValidationMiddleware({}))
playerManagementRouter.post('/player/update-comment', isAuthenticated(resources.player.update), databaseTransactionHandlerMiddleware, PlayerController.updateComment, responseValidationMiddleware({}))

// PUT REQUESTS
playerManagementRouter.put('/spin-wheel/update-config', isAuthenticated(resources.spinWheelConfiguration.update), databaseTransactionHandlerMiddleware, WheelDivisionConfigController.updateSpinWheelConfig, responseValidationMiddleware({}))
playerManagementRouter.put('/kyc/verify', isAuthenticated(resources.player.verify_kyc), databaseTransactionHandlerMiddleware, KycController.verifyKyc, responseValidationMiddleware(successSchema))
playerManagementRouter.put('/segment', isAuthenticated(resources.segmentation.update), requestValidationMiddleware(updateSegmentSchema), databaseTransactionHandlerMiddleware, SegmentController.editSegment, responseValidationMiddleware(updateSegmentSchema))
playerManagementRouter.put('/reset/profile-limit', isAuthenticated(resources.player.update), databaseTransactionHandlerMiddleware, PlayerController.resetProfileUpdateLimit, responseValidationMiddleware(successSchema))

// DELETE REQUESTS
playerManagementRouter.delete('/player/comment', isAuthenticated(), PlayerController.deleteComment, responseValidationMiddleware({}))
playerManagementRouter.delete('/tag', isAuthenticated(resources.segmentation.delete), TagController.deleteTag, responseValidationMiddleware(successSchema))
playerManagementRouter.delete('/segment', requestValidationMiddleware(deleteSegmentSchema), isAuthenticated(resources.segmentation.delete), databaseTransactionHandlerMiddleware, SegmentController.deleteSegment, responseValidationMiddleware(successSchema))

export { playerManagementRouter }
