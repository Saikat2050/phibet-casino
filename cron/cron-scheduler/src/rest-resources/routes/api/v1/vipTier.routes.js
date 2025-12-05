import VipTierController from '@src/rest-resources/controllers/vipTier.controller'
import { isBasicAuthenticatedMiddleware } from '@src/rest-resources/middlewares/isBasicAuthenticated.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const tierRouter = express.Router()

tierRouter
  .route('/')
  .post(
    isBasicAuthenticatedMiddleware,
    VipTierController.addJobToQueue,
    responseValidationMiddleware({})
  )

export default tierRouter
