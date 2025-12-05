import VipSystemController from '@src/rest-resources/controllers/vipSystem.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { successSchema } from '@src/schema/successResponse.schema'
import { resources } from '@src/utils/constants/permission.constant'
import express from 'express'

const vipSystemManagementRouter = express.Router({ mergeParams: true })

vipSystemManagementRouter.route('/')
  .post(isAuthenticated(resources.vip.create), databaseTransactionHandlerMiddleware, VipSystemController.createVipTiers, responseValidationMiddleware(successSchema))
  .put(isAuthenticated(resources.vip.update), databaseTransactionHandlerMiddleware, VipSystemController.updateVipTiers, responseValidationMiddleware(successSchema))
  .get(isAuthenticated(resources.vip.read), VipSystemController.getVipTiers, responseValidationMiddleware({}))

vipSystemManagementRouter.get('/details', isAuthenticated(resources.vip.read), VipSystemController.getVipTierDetails, responseValidationMiddleware({}))

export { vipSystemManagementRouter }
