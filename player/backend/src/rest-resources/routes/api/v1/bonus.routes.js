import BonusController from '@src/rest-resources/controllers/bonus.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { isSemiAuthenticated } from '@src/rest-resources/middlewares/isSemiAuthenticated'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const bonusRouter = express.Router({ mergeParams: true })

bonusRouter.get('/user', isAuthenticated, BonusController.getUserBonus, responseValidationMiddleware({}))
bonusRouter.get('/detail', BonusController.getBonusDetail, responseValidationMiddleware({}))
bonusRouter.post('/avail', isAuthenticated, databaseTransactionHandlerMiddleware, BonusController.availBonus, responseValidationMiddleware({}))
bonusRouter.post('/cancel', isAuthenticated, databaseTransactionHandlerMiddleware, BonusController.cancelBonus, responseValidationMiddleware({}))
bonusRouter.get('/', isSemiAuthenticated, BonusController.getAllBonus, responseValidationMiddleware({}))
bonusRouter.post('/avail-daily-bonus', isAuthenticated, databaseTransactionHandlerMiddleware, BonusController.availDailyBonus, responseValidationMiddleware({}))
bonusRouter.post('/avail-joining-bonus', isAuthenticated, databaseTransactionHandlerMiddleware, BonusController.availJoiningBonus, responseValidationMiddleware({}))
bonusRouter.post('/avail-birthday-bonus', isAuthenticated, databaseTransactionHandlerMiddleware, BonusController.availBirthdayBonus, responseValidationMiddleware({}))

export { bonusRouter }
