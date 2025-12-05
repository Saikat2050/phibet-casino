import JackpotController from '@src/rest-resources/controllers/jackpot.controller'
import { isBasicAuthenticatedMiddleware } from '@src/rest-resources/middlewares/isBasicAuthenticated.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const jackpotRouter = express.Router()
jackpotRouter.route('/').post(
  isBasicAuthenticatedMiddleware,
  JackpotController.addJobToQueue,
  responseValidationMiddleware({})
)

export default jackpotRouter
