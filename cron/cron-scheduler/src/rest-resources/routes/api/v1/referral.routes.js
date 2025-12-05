import ReferralController from '@src/rest-resources/controllers/referral.controller'
import { isBasicAuthenticatedMiddleware } from '@src/rest-resources/middlewares/isBasicAuthenticated.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const referralRouter = express.Router()
referralRouter.route('/').post(
  isBasicAuthenticatedMiddleware,
  ReferralController.addJobToQueue,
  responseValidationMiddleware({})
)

export default referralRouter
