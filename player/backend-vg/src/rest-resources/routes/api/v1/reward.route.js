import express from 'express'
import RewardController from '../../../controllers/reward.controller'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import { isUserAuthenticated } from '../../../middlewares/isUserAuthenticated.middleware'
import { userRaffleTicketSchemas } from '../../../middlewares/validation/schema.validate'
const rewardsRouter = express.Router()

rewardsRouter
  .route('/tiers')
  .get(
    contextMiddleware(false),
    requestValidationMiddleware(),
    RewardController.getTierDetails,
    responseValidationMiddleware()
  )
rewardsRouter
  .route('/welcome-bonus')
  .get(
    contextMiddleware(false),
    requestValidationMiddleware(),
    isUserAuthenticated,
    RewardController.getWelcomeBonusDetails,
    responseValidationMiddleware()
  )
rewardsRouter
  .route('/raffle-promotion')
  .get(
    contextMiddleware(false),
    requestValidationMiddleware(),
    RewardController.getRafflePromotion,
    responseValidationMiddleware()
  )
rewardsRouter
  .route('/raffle-detail')
  .get(
    contextMiddleware(false),
    requestValidationMiddleware(),
    RewardController.getRaffleDetail,
    responseValidationMiddleware()
  )

rewardsRouter
  .route('/userRaffleTicket')
  .get(
    contextMiddleware(false),
    requestValidationMiddleware(userRaffleTicketSchemas),
    isUserAuthenticated,
    RewardController.getUserRaffleTickets,
    responseValidationMiddleware({})
  )

export default rewardsRouter
