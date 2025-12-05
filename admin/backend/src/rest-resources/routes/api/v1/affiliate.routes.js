import { AffiliateController } from '@src/rest-resources/controllers/affiliate.controller'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const affiliateRouter = express.Router({ mergeParams: true })

// POST REQUESTS
affiliateRouter.get('/callback/scaleo', AffiliateController.scaleoEventWebhook, responseValidationMiddleware({}))

export { affiliateRouter }
