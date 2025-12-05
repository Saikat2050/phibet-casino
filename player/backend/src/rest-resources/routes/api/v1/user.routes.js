import { GoogleAuthenticatorController, UserController, VipController } from '@src/rest-resources/controllers/user.controller'
import { VerificationController } from '@src/rest-resources/controllers/verification.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { isSemiAuthenticated } from '@src/rest-resources/middlewares/isSemiAuthenticated'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { fileUploadSchema, successSchema } from '@src/schema/common'
import { addAddressSchema, checkUserSchema, getAddressesSchema, getTransactionsSchema, getUserSchema, getWalletsSchema, removeAddressSchema, updateAddressSchema, userForgotPasswordSchema, userLoginSchema, userSignupSchema, userUpdateSchema } from '@src/schema/user'
import { addPaymentCardSchema } from '@src/schema/user/addPaymentCard.schema'
import { updatePaymentCardSchema } from '@src/schema/user/updatePaymentCard.schema'
import { deletePaymentCardSchema } from '@src/schema/user/deletePaymentCard.schema'
import { getPaymentCardsSchema } from '@src/schema/user/getPaymentCards.schema'
import { getPaymentCardDetailsSchema } from '@src/schema/user/getPaymentCardDetails.schema'
import { depositSchema } from '@src/schema/user/deposit.schema'
import { facebookSignupLoginSchema } from '@src/schema/user/facebookSignupLogin.schema'
import { userGoogleSignupLoginSchema } from '@src/schema/user/googleSignupLogin.schema'
import { verfiyEmailSchema } from '@src/schema/user/verifyEmail.schema'
import express from 'express'

const supportedFileFormat = ['png', 'jpg', 'jpeg']
const userRouter = express.Router({ mergeParams: true })

// GET REQUESTS
userRouter.get('/', isAuthenticated, UserController.getUser, responseValidationMiddleware(getUserSchema))
userRouter.get('/wallets', isAuthenticated, UserController.getWallets, responseValidationMiddleware(getWalletsSchema))
userRouter.get('/transactions', isAuthenticated, UserController.getTransactions, responseValidationMiddleware(getTransactionsSchema))
userRouter.get('/addresses', isAuthenticated, UserController.getAddresses, responseValidationMiddleware(getAddressesSchema))
userRouter.get('/verify-email', requestValidationMiddleware(verfiyEmailSchema), databaseTransactionHandlerMiddleware, VerificationController.verifyEmail, responseValidationMiddleware({}))
userRouter.get('/check', requestValidationMiddleware(checkUserSchema), UserController.checkUser, responseValidationMiddleware(checkUserSchema))
userRouter.get('/recent-games', isAuthenticated, UserController.getRecentGames, responseValidationMiddleware({}))
userRouter.get('/referred-users', isAuthenticated, UserController.getReferredUser, responseValidationMiddleware({}))
userRouter.get('/list', isSemiAuthenticated, UserController.getUserList, responseValidationMiddleware({}))
userRouter.get('/chat-setting', UserController.getDefaultChatSettings, responseValidationMiddleware({}))
userRouter.get('/resend-email', isAuthenticated, VerificationController.resendEmail, responseValidationMiddleware({}))
userRouter.get('/vip-tiers', isAuthenticated, VipController.getVipTiers, responseValidationMiddleware({}))
userRouter.get('/referral-user-details', isAuthenticated, UserController.getReferralUserDetails, responseValidationMiddleware({}))
userRouter.get('/promo-code', isAuthenticated, requestValidationMiddleware({}), UserController.getPromocodeDetails, responseValidationMiddleware({}))
userRouter.get('/payment-cards', isAuthenticated, UserController.getPaymentCards, responseValidationMiddleware(getPaymentCardsSchema))
userRouter.get('/payment-card-details', isAuthenticated, UserController.getPaymentCardDetails, responseValidationMiddleware(getPaymentCardDetailsSchema))

// POST REQUESTS
userRouter.post('/login', requestValidationMiddleware(userLoginSchema), UserController.login, responseValidationMiddleware(userLoginSchema))
userRouter.post('/google-signup-login', requestValidationMiddleware(userGoogleSignupLoginSchema), databaseTransactionHandlerMiddleware, UserController.googleSignUpLogin, responseValidationMiddleware({}))
userRouter.post('/facebook-signup-login', requestValidationMiddleware(facebookSignupLoginSchema), databaseTransactionHandlerMiddleware, UserController.facebookSignUpLogin, responseValidationMiddleware({}))
userRouter.post('/signup', requestValidationMiddleware(userSignupSchema), databaseTransactionHandlerMiddleware, UserController.signup, responseValidationMiddleware(userSignupSchema))
userRouter.post('/logout', isAuthenticated, UserController.logout, responseValidationMiddleware(successSchema))
userRouter.post('/add-address', isAuthenticated, requestValidationMiddleware(addAddressSchema), UserController.addAddress, responseValidationMiddleware(addAddressSchema))
userRouter.post('/deposit', isAuthenticated, requestValidationMiddleware(depositSchema), UserController.deposit, responseValidationMiddleware(depositSchema))
userRouter.get('/init-kyc', isAuthenticated, databaseTransactionHandlerMiddleware, VerificationController.initIDComplyKyc, responseValidationMiddleware({}))
userRouter.post('/forgot-password', VerificationController.forgotPassword, responseValidationMiddleware(userForgotPasswordSchema))
userRouter.post('/apply-promocode', isAuthenticated, requestValidationMiddleware({}), UserController.applyPromocode, responseValidationMiddleware({}))
userRouter.post('/payment-cards', isAuthenticated, requestValidationMiddleware(addPaymentCardSchema), databaseTransactionHandlerMiddleware, UserController.addPaymentCard, responseValidationMiddleware(addPaymentCardSchema))

userRouter.put('/session-limit', isAuthenticated, UserController.updateSessionLimit, responseValidationMiddleware(successSchema))
userRouter.put('/', isAuthenticated, requestValidationMiddleware(userUpdateSchema), UserController.update, responseValidationMiddleware(userUpdateSchema))
userRouter.put('/address', isAuthenticated, requestValidationMiddleware(updateAddressSchema), UserController.updateAddress, responseValidationMiddleware(updateAddressSchema))
userRouter.put('/remove-address', isAuthenticated, requestValidationMiddleware(removeAddressSchema), UserController.removeAddress, responseValidationMiddleware(successSchema))
userRouter.put('/verify-password', VerificationController.verifyForgotPassword, responseValidationMiddleware(successSchema))
userRouter.put('/profile-image', isAuthenticated, fileUpload(supportedFileFormat).single('file'), UserController.uploadProfileImage, responseValidationMiddleware(fileUploadSchema))
userRouter.put('/wallet/default', isAuthenticated, databaseTransactionHandlerMiddleware, UserController.setDefaultWallet, responseValidationMiddleware({}))
userRouter.put('/payment-cards', isAuthenticated, requestValidationMiddleware(updatePaymentCardSchema), databaseTransactionHandlerMiddleware, UserController.updatePaymentCard, responseValidationMiddleware(updatePaymentCardSchema))
userRouter.delete('/payment-cards', isAuthenticated, requestValidationMiddleware(deletePaymentCardSchema), databaseTransactionHandlerMiddleware, UserController.deletePaymentCard, responseValidationMiddleware(successSchema))

// 2FA (Google Authenticator)
userRouter.get('/2fa/generate-otp', isAuthenticated, databaseTransactionHandlerMiddleware, GoogleAuthenticatorController.generateOtp, responseValidationMiddleware({}))
userRouter.post('/2fa/verify-otp', isAuthenticated, databaseTransactionHandlerMiddleware, GoogleAuthenticatorController.verifyOtp, responseValidationMiddleware({}))
userRouter.post('/2fa', isAuthenticated, databaseTransactionHandlerMiddleware, GoogleAuthenticatorController.disableAuth, responseValidationMiddleware({}))

export { userRouter }
