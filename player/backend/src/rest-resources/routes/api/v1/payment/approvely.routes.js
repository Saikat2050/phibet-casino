import { ApprovelyController } from '@src/rest-resources/controllers/payment/approvely.controller'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const approvelyRouter = express.Router()

// GET REQUESTS
approvelyRouter.get('/withdrawer', isAuthenticated, ApprovelyController.approvelyGetWithdrawer, responseValidationMiddleware({}))
approvelyRouter.post('/bank', isAuthenticated, ApprovelyController.approvelyCreateBank, responseValidationMiddleware({}))
approvelyRouter.post('/debit-card', isAuthenticated, ApprovelyController.approvelyCreateDebitCard, responseValidationMiddleware({}))

export { approvelyRouter }
