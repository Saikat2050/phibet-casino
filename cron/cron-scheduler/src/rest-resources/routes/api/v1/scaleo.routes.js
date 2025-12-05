import ScaleoController from '@src/rest-resources/controllers/scaleo.controller'
import { isBasicAuthenticatedMiddleware } from '@src/rest-resources/middlewares/isBasicAuthenticated.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const scaleoRouter = express.Router()

scaleoRouter
  .route('/')
  .post(
    isBasicAuthenticatedMiddleware,
    ScaleoController.addJobToQueue,
    responseValidationMiddleware({})
  )

export default scaleoRouter
