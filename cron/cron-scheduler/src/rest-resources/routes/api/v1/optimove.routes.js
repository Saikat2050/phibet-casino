import OptimoveController from '@src/rest-resources/controllers/optimove.controller'
import { isBasicAuthenticatedMiddleware } from '@src/rest-resources/middlewares/isBasicAuthenticated.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const optimoveRouter = express.Router()
optimoveRouter
  .route('/')
  .post(
    isBasicAuthenticatedMiddleware,
    OptimoveController.createOptimoveJobs,
    responseValidationMiddleware({})
  )

export default optimoveRouter
