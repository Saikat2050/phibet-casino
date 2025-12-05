import UserController from '@src/rest-resources/controllers/user.controller'
import { isBasicAuthenticatedMiddleware } from '@src/rest-resources/middlewares/isBasicAuthenticated.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const userRouter = express.Router()
userRouter.route('/limits').post(
  isBasicAuthenticatedMiddleware,
  UserController.addJobToQueue,
  responseValidationMiddleware({})
)

export default userRouter
