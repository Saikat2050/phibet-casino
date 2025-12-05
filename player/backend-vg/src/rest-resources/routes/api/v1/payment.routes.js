import express from 'express'
import contextMiddleware from '../../../middlewares/context.middleware'
import PaymentController from '../../../controllers/payment.controller'
import { isUserAuthenticated } from '../../../middlewares/isUserAuthenticated.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import {
  cancelRedeemRequestSchema,
  getBetsSchemas,
  getRedeemRequests,
  initPaySchema,
  payByBankRequestSchema,
  updateRedeemRequestSchema,
  vaultDepositRequestSchema,
  vaultWithdrawRequestSchema
} from '../../../middlewares/validation/schema.validate'

const args = { mergeParams: true }
const paymentRouter = express.Router(args)

paymentRouter
  .route('/init-pay')
  .post(
    requestValidationMiddleware(initPaySchema),
    isUserAuthenticated,
    contextMiddleware(true),
    PaymentController.initPay,
    responseValidationMiddleware(initPaySchema)
  )

paymentRouter
  .route('/transactions')
  .get(
    requestValidationMiddleware(getBetsSchemas),
    contextMiddleware(false),
    isUserAuthenticated,
    PaymentController.getTransactions,
    responseValidationMiddleware(getBetsSchemas)
  )
paymentRouter
  .route('/update-bonus-win-transactions')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    //  isUserAuthenticated,
    PaymentController.updateBonusWinTransaction,
    responseValidationMiddleware({})
  )
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    //  isUserAuthenticated,
    PaymentController.sendDepositEvents,
    responseValidationMiddleware({})
  )
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    //  isUserAuthenticated,
    PaymentController.sendWithdrawEvents,
    responseValidationMiddleware({})
  )

paymentRouter
  .route('/transactions/:transactionId')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isUserAuthenticated,
    PaymentController.getTransactionDetail,
    responseValidationMiddleware()
  )

paymentRouter
  .route('/redeem-request')
  .put(
    requestValidationMiddleware(cancelRedeemRequestSchema),
    contextMiddleware(true),
    isUserAuthenticated,
    PaymentController.cancelRedeemRequests,
    responseValidationMiddleware(cancelRedeemRequestSchema)
  )
  .get(
    requestValidationMiddleware(getRedeemRequests),
    contextMiddleware(false),
    isUserAuthenticated,
    PaymentController.getRedeemRequests,
    responseValidationMiddleware(getRedeemRequests)
  )
  .patch(
    requestValidationMiddleware(updateRedeemRequestSchema),
    contextMiddleware(true),
    isUserAuthenticated,
    PaymentController.updateRedeemRequests,
    responseValidationMiddleware(updateRedeemRequestSchema)
  )

paymentRouter
  .route('/redeem/pay-by-bank')
  .get(
    requestValidationMiddleware(payByBankRequestSchema),
    contextMiddleware(false),
    isUserAuthenticated,
    PaymentController.getUserBankAccountDetails,
    responseValidationMiddleware(payByBankRequestSchema)
  )
  .post(
    requestValidationMiddleware(payByBankRequestSchema),
    contextMiddleware(false),
    isUserAuthenticated,
    PaymentController.initiateBankAccountRegistration,
    responseValidationMiddleware(payByBankRequestSchema)
  )

paymentRouter
  .route('/paysafe')
  .post(
    requestValidationMiddleware(),
    contextMiddleware(true),
    PaymentController.updatePaysafeStatus,
    responseValidationMiddleware()
  )

paymentRouter
  .route('/vault-deposit')
  .post(
    requestValidationMiddleware(vaultDepositRequestSchema),
    contextMiddleware(true),
    isUserAuthenticated,
    PaymentController.vaultDepositRequests,
    responseValidationMiddleware(vaultDepositRequestSchema)
  )

paymentRouter
  .route('/vault-withdraw')
  .post(
    requestValidationMiddleware(vaultWithdrawRequestSchema),
    contextMiddleware(true),
    isUserAuthenticated,
    PaymentController.vaultWithdrawRequests,
    responseValidationMiddleware(vaultWithdrawRequestSchema)
  )

paymentRouter
  .route('/vault-detail')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isUserAuthenticated,
    PaymentController.getVaultDetail,
    responseValidationMiddleware({})
  )
paymentRouter
  .route('/approvely')
  .post(
    requestValidationMiddleware(),
    contextMiddleware(true),
    PaymentController.updateApprovelyStatus,
    responseValidationMiddleware()
  )
paymentRouter
  .route('/pushcash')
  .post(
    requestValidationMiddleware(),
    contextMiddleware(true),
    PaymentController.updatePushcashStatus,
    responseValidationMiddleware()
  )
paymentRouter
  .route('/promocode')
  .post(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isUserAuthenticated,
    PaymentController.applyPromocode,
    responseValidationMiddleware()
  )
  .delete(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isUserAuthenticated,
    PaymentController.removePromocode,
    responseValidationMiddleware()
  )

paymentRouter
  .route('/payment-provider')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isUserAuthenticated,
    PaymentController.getAllPaymentProvider,
    responseValidationMiddleware({})
  )

paymentRouter
  .route('/finix/create-instrument')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isUserAuthenticated,
    PaymentController.createPaymentInstrument,
    responseValidationMiddleware({})
  )

paymentRouter
  .route('/finix/apple-pay-session')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isUserAuthenticated,
    PaymentController.applePaySessions,
    responseValidationMiddleware({})
  )

paymentRouter
  .route('/finix/apple-pay-info')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isUserAuthenticated,
    PaymentController.applePayMerchantInfo,
    responseValidationMiddleware({})
  )
export default paymentRouter
