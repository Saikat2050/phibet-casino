import BonusController from '@src/rest-resources/controllers/bonus.controller'
import { ReferralController } from '@src/rest-resources/controllers/referral.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { resources } from '@src/utils/constants/permission.constant'
import { createBonusSchema } from '@src/schema/bonus/createBonus.schema'
import { successSchema } from '@src/schema/successResponse.schema'
import { issueBonusSchema } from '@src/schema/bonus/issueBonus.schema'
import { getBonusSchema } from '@src/schema/bonus/getBonus.schema'
import { getBonusDetailsSchema } from '@src/schema/bonus/getBonusDetails.schema'
import { getReferralUserSchema } from '@src/schema/bonus/referral/getReferralUser.schema'
import { getReferralTransactionSchema } from '@src/schema/bonus/referral/getReferralTransaction.schema'

import express from 'express'

const bonusManagementRouter = express.Router({ mergeParams: true })

// GET REQUESTS
bonusManagementRouter.get('/bonus', isAuthenticated(resources.bonus.read), BonusController.getBonusDetail, responseValidationMiddleware({}))
bonusManagementRouter.get('/bonuses', isAuthenticated(resources.bonus.read), BonusController.getAllBonus, responseValidationMiddleware({}))
bonusManagementRouter.get('/referral/users', isAuthenticated(resources.referral.read), ReferralController.getReferralUserDetails, responseValidationMiddleware(getReferralUserSchema))
bonusManagementRouter.get('/referral/transactions', isAuthenticated(resources.referral.read), ReferralController.getReferralTransactions, responseValidationMiddleware(getReferralTransactionSchema))

// POST REQUESTS
bonusManagementRouter.post('/bonus/create', isAuthenticated(resources.bonus.create), databaseTransactionHandlerMiddleware, BonusController.createBonus, responseValidationMiddleware(createBonusSchema))
bonusManagementRouter.post('/bonus/update', isAuthenticated(resources.bonus.update), databaseTransactionHandlerMiddleware, BonusController.updateBonus, responseValidationMiddleware(createBonusSchema))
bonusManagementRouter.post('/bonus/toggle', isAuthenticated(resources.bonus.toggle), BonusController.toggleBonus, responseValidationMiddleware(successSchema))
bonusManagementRouter.post('/bonus/issue', isAuthenticated(resources.bonus.issue), databaseTransactionHandlerMiddleware, BonusController.issueBonus, responseValidationMiddleware(issueBonusSchema))
bonusManagementRouter.post('/referral/update', isAuthenticated(resources.referral.update), ReferralController.referralUpdate, responseValidationMiddleware(successSchema))

// DELETE REQUEST
bonusManagementRouter.delete('/bonus/delete', isAuthenticated(resources.bonus.delete), BonusController.deleteBonus, responseValidationMiddleware(successSchema))

export { bonusManagementRouter }
