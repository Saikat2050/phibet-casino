import express from 'express'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import PaymentProviderController from '@src/rest-resources/controllers/payment.controller'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { getWithdrawalSchema } from '@src/schema/payment/getWithdrawal.schema'
import { getUserPaymentCardsSchema } from '@src/schema/payment/getUserPaymentCards.schema'
import { resources } from '@src/utils/constants/permission.constant'
import { successSchema } from '@src/schema/successResponse.schema'

const supportedFileFormat = ['png', 'jpg', 'jpeg', 'tiff', 'svg+xml', 'webp', 'svg']
const paymentRouter = express.Router({ mergeParams: true })

// GET REQUESTS
paymentRouter.get('/details', isAuthenticated(resources.paymentManagement.read), PaymentProviderController.getPaymentProvider, responseValidationMiddleware({}))
paymentRouter.get('/withdrawal', isAuthenticated(resources.redeem.read), PaymentProviderController.getWithdrawals, responseValidationMiddleware(getWithdrawalSchema))
paymentRouter.get('/aggregators', isAuthenticated(resources.paymentManagement.read), PaymentProviderController.getPaymentAggregator, responseValidationMiddleware({}))
paymentRouter.get('/user-payment-cards', isAuthenticated(resources.paymentManagement.read), PaymentProviderController.getUserPaymentCards, responseValidationMiddleware(getUserPaymentCardsSchema))

// POST REQUESTS
paymentRouter.post('/withdrawal', isAuthenticated(resources.redeem.update), databaseTransactionHandlerMiddleware, PaymentProviderController.approveRejectWithdrawal, responseValidationMiddleware(successSchema))

paymentRouter.route('/')
  .get(isAuthenticated(resources.paymentManagement.read), PaymentProviderController.getAllPaymentProviders, responseValidationMiddleware({}))
  .put(isAuthenticated(resources.paymentManagement.update), fileUpload(supportedFileFormat).any(), databaseTransactionHandlerMiddleware, PaymentProviderController.updatePaymentProvider, responseValidationMiddleware({}))
  .post(isAuthenticated(resources.paymentManagement.create), fileUpload(supportedFileFormat).any(), databaseTransactionHandlerMiddleware, PaymentProviderController.createPaymentProvider, responseValidationMiddleware({}))

export { paymentRouter }
