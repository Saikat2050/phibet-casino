import express from 'express'
import multer from 'multer'
import PlayerController from '../../../controllers/player.controller'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import { isUserAuthenticated } from '../../../middlewares/isUserAuthenticated.middleware'
import contextMiddleware from '../../../middlewares/context.middleware'
import { requiredDeviceValidationMiddleware } from '../../../middlewares/deviceValidation.middleware'
import {
  isUserNameExist,
  signUpSchemas,
  loginSchemas,
  verifyEmailSchemas,
  updateProfileSchemas,
  changePasswordSchemas,
  forgetPasswordSchema,
  getPackagesSchemas,
  cmsSchemas,
  cmsDetailSchemas,
  defaultResponseSchemas,
  getGamesSchemas,
  launchGameSchemas,
  getFavourateGamesSchemas,
  favoriteSchema,
  getBetsSchemas,
  responsibleGamblingSchema,
  googleLoginSchemas,
  facebookLoginSchemas,
  claimDailyBonusSchema,
  getGamblingSchema,
  verifyForgetPasswordSchema,
  appleLoginSchemas,
  applyAffiliateSchemas,
  termAndConditionSchemas,
  phoneSchemas,
  UpdateEmailSchemas,
  userFeedbackSchema
} from '../../../middlewares/validation/schema.validate'

import { regionAllowedMiddleware } from '../../../middlewares/regionAllowed.middleware'
import {
  appleLoginEmail,
  googleLoginEmail
} from '../../../middlewares/SSO.middleware'

const args = { mergeParams: true }
const playerRouter = express.Router(args)
const upload = multer()

playerRouter
  .route('/accessAllowed')
  .get(
    regionAllowedMiddleware,
    PlayerController.accessAllow,
    responseValidationMiddleware({})
  )

playerRouter
  .route('/signup-allowed')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    PlayerController.signupAllowed,
    responseValidationMiddleware({})
  )

playerRouter
  .route('/sign-up')
  .get(
    requestValidationMiddleware(isUserNameExist),
    contextMiddleware(false),
    PlayerController.userNameCheck,
    responseValidationMiddleware()
  )
  .post(
    requestValidationMiddleware(signUpSchemas),
    contextMiddleware(true),
    requiredDeviceValidationMiddleware('signup'),
    PlayerController.playerSignUp,
    // regionAllowedMiddleware,
    responseValidationMiddleware(signUpSchemas)
  )
  .put(
    requestValidationMiddleware(),
    contextMiddleware(true),
    PlayerController.addUserName,
    responseValidationMiddleware()
  )

playerRouter
  .route('/update-email')
  .post(
    requestValidationMiddleware(UpdateEmailSchemas),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.updateEmail,
    responseValidationMiddleware(UpdateEmailSchemas)
  )
playerRouter
  .route('/verifyEmail')
  .post(
    requestValidationMiddleware(verifyEmailSchemas),
    contextMiddleware(true),
    PlayerController.verifyEmail,
    responseValidationMiddleware(verifyEmailSchemas)
  )

playerRouter
  .route('/resendVerifyEmail')
  .post(
    requestValidationMiddleware(forgetPasswordSchema),
    contextMiddleware(true),
    PlayerController.resendVerificationMail,
    responseValidationMiddleware(defaultResponseSchemas)
  )

playerRouter
  .route('/login')
  .post(
    requestValidationMiddleware(loginSchemas),
    contextMiddleware(true),
    requiredDeviceValidationMiddleware('login'),
    PlayerController.userLogin,
    // regionAllowedMiddleware,
    responseValidationMiddleware(loginSchemas)
  )

playerRouter
  .route('/googleLogin')
  .post(
    requestValidationMiddleware(googleLoginSchemas),
    googleLoginEmail,
    contextMiddleware(true),
    requiredDeviceValidationMiddleware('google-login'),
    PlayerController.googleLogin,
    // regionAllowedMiddleware,
    responseValidationMiddleware(googleLoginSchemas)
  )

playerRouter
  .route('/facebookLogin')
  .post(
    requestValidationMiddleware(facebookLoginSchemas),
    contextMiddleware(true),
    // requiredDeviceValidationMiddleware('facebook-login'),
    PlayerController.facebookLogin,
    //  regionAllowedMiddleware,
    responseValidationMiddleware(facebookLoginSchemas)
  )

playerRouter
  .route('/appleLogin')
  .post(
    requestValidationMiddleware(appleLoginSchemas),
    appleLoginEmail,
    contextMiddleware(true),
    // requiredDeviceValidationMiddleware('apple-login'),
    PlayerController.appleLogin,
    //  regionAllowedMiddleware,
    responseValidationMiddleware(appleLoginSchemas)
  )

// Phone Verification
playerRouter
  .route('/phone')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.sendOTP,
    responseValidationMiddleware(defaultResponseSchemas)
  )

playerRouter
  .route('/phoneVerify')
  .post(
    requestValidationMiddleware(phoneSchemas),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.verifyOtp,
    responseValidationMiddleware(phoneSchemas)
  )
// Password Flow
playerRouter
  .route('/forgetPassword')
  .post(
    requestValidationMiddleware(forgetPasswordSchema),
    contextMiddleware(true),
    PlayerController.forgetPassword,
    responseValidationMiddleware(defaultResponseSchemas)
  )

playerRouter
  .route('/verifyForgetPassword')
  .post(
    requestValidationMiddleware(verifyForgetPasswordSchema),
    contextMiddleware(true),
    PlayerController.verifyForgetPassword,
    responseValidationMiddleware(defaultResponseSchemas)
  )

playerRouter.route('/changePassword').put(
  requestValidationMiddleware(changePasswordSchemas),
  contextMiddleware(true),
  isUserAuthenticated,
  PlayerController.changePassword,
  responseValidationMiddleware(defaultResponseSchemas)
)

playerRouter
  .route('/profile')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isUserAuthenticated,
    PlayerController.userProfile,
    responseValidationMiddleware(defaultResponseSchemas)
  )
  .post(
    requestValidationMiddleware(updateProfileSchemas),
    // regionAllowedMiddleware,
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.updateProfile,
    // regionAllowedMiddleware,
    responseValidationMiddleware(defaultResponseSchemas)
  )
  .put(
    upload.any('document'),
    requestValidationMiddleware(),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.uploadUserProfileImage,
    responseValidationMiddleware()
  )

playerRouter.route('/logout').post(
  isUserAuthenticated,
  PlayerController.userLogout,
  responseValidationMiddleware({})
)

playerRouter
  .route('/daily-bonus')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isUserAuthenticated,
    // logTimeMiddleWare,
    PlayerController.getDailyBonus,
    responseValidationMiddleware({})
  )
  .post(
    requestValidationMiddleware(claimDailyBonusSchema),
    isUserAuthenticated,
    // regionAllowedMiddleware,
    contextMiddleware(true),
    // logTimeMiddleWare,
    PlayerController.claimDailyBonus,
    responseValidationMiddleware({})
  )

playerRouter.route('/packages').get(
  requestValidationMiddleware(getPackagesSchemas),
  contextMiddleware(false),
  // logTimeMiddleWare,
  PlayerController.getPackages,
  responseValidationMiddleware(getPackagesSchemas)
)

playerRouter.route('/cms').get(
  requestValidationMiddleware(cmsSchemas),
  contextMiddleware(false),
  // logTimeMiddleWare,
  PlayerController.getCMS,
  responseValidationMiddleware(cmsSchemas)
)

playerRouter.route('/cms-detail').get(
  requestValidationMiddleware(cmsDetailSchemas),
  contextMiddleware(false),
  // logTimeMiddleWare,
  PlayerController.getCMSDetail,
  responseValidationMiddleware(cmsDetailSchemas)
)

playerRouter.route('/casino-games').get(
  requestValidationMiddleware(),
  contextMiddleware(false),
  // logTimeMiddleWare,
  PlayerController.getGames,
  responseValidationMiddleware(getGamesSchemas)
)

playerRouter.route('/sub-category').get(
  requestValidationMiddleware({}),
  contextMiddleware(false),
  // logTimeMiddleWare,
  PlayerController.getSubCategory,
  responseValidationMiddleware({})
)

playerRouter.route('/category').get(
  requestValidationMiddleware({}),
  contextMiddleware(false),
  // logTimeMiddleWare,
  PlayerController.getCategories,
  responseValidationMiddleware({})
)

playerRouter
  .route('/welcome-bonus')
  .get(
    requestValidationMiddleware({}),
    isUserAuthenticated,
    contextMiddleware(false),
    // logTimeMiddleWare,
    PlayerController.getWelcomeBonus,
    responseValidationMiddleware({})
  )
  .post(
    requestValidationMiddleware({}),
    isUserAuthenticated,
    // regionAllowedMiddleware,
    contextMiddleware(true),
    // logTimeMiddleWare,
    PlayerController.claimWelcomeBonus,
    responseValidationMiddleware({})
  )

playerRouter.route('/launch-game').post(
  requestValidationMiddleware(launchGameSchemas),
  contextMiddleware(false),
  isUserAuthenticated,
  // logTimeMiddleWare,
  PlayerController.launchGame,
  responseValidationMiddleware({})
)

playerRouter.route('/demo/launch-game').post(
  requestValidationMiddleware(launchGameSchemas),
  contextMiddleware(false),
  // logTimeMiddleWare,
  PlayerController.launchGame,
  responseValidationMiddleware({})
)

playerRouter.route('/bets').get(
  requestValidationMiddleware(getBetsSchemas),
  contextMiddleware(false),
  isUserAuthenticated,
  // logTimeMiddleWare,
  PlayerController.getBets,
  responseValidationMiddleware(getBetsSchemas)
)

playerRouter
  .route('/favorite')
  .get(
    requestValidationMiddleware(getFavourateGamesSchemas),
    contextMiddleware(false),
    isUserAuthenticated,
    // logTimeMiddleWare,
    PlayerController.getFavoriteGame,
    responseValidationMiddleware(getFavourateGamesSchemas)
  )
  .post(
    requestValidationMiddleware(favoriteSchema),
    contextMiddleware(true),
    isUserAuthenticated,
    // logTimeMiddleWare,
    PlayerController.favoriteGame,
    responseValidationMiddleware({})
  )

playerRouter.route('/state').get(
  requestValidationMiddleware({}),
  contextMiddleware(false),
  // logTimeMiddleWare,
  PlayerController.getState,
  responseValidationMiddleware({})
)

playerRouter.route('/city').get(
  requestValidationMiddleware({}),
  contextMiddleware(false),
  // logTimeMiddleWare,
  PlayerController.getCity,
  responseValidationMiddleware({})
)

playerRouter
  .route('/responsible-gaming')
  .post(
    requestValidationMiddleware(responsibleGamblingSchema),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.responsibleGambling,
    responseValidationMiddleware({})
  )

playerRouter.route('/gambling-history').get(
  requestValidationMiddleware({}),
  contextMiddleware(false),
  isUserAuthenticated,
  // logTimeMiddleWare,
  PlayerController.responsibleGamblingHistory,
  responseValidationMiddleware({})
)

playerRouter.route('/banners').get(
  requestValidationMiddleware({}),
  contextMiddleware(false),
  // logTimeMiddleWare,
  PlayerController.getBanners,
  responseValidationMiddleware({})
)

playerRouter
  .route('/postal-code')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isUserAuthenticated,
    // logTimeMiddleWare,
    PlayerController.getPostalCode,
    responseValidationMiddleware({})
  )
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isUserAuthenticated,
    // logTimeMiddleWare,
    PlayerController.createPostalCode,
    responseValidationMiddleware({})
  )

playerRouter.route('/get-gambling').get(
  requestValidationMiddleware(getGamblingSchema),
  contextMiddleware(false),
  isUserAuthenticated,
  // logTimeMiddleWare,
  PlayerController.getResponsibleGambling,
  responseValidationMiddleware({})
)

playerRouter
  .route('/init-kyc')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.initKYC,
    // regionAllowedMiddleware,
    responseValidationMiddleware({})
  )

playerRouter.route('/remove-responsible-setting').put(
  upload.any(),
  requestValidationMiddleware({}),
  contextMiddleware(true),
  isUserAuthenticated,
  // logTimeMiddleWare,
  PlayerController.removeResponsibleGamingSetting,
  responseValidationMiddleware({})
)

// playerRouter.route('/live-winners').get(
//   requestValidationMiddleware({}),
//   contextMiddleware(false),
//   PlayerController.getLiveWinners,
//   responseValidationMiddleware({})
// )

playerRouter.route('/recently-played').get(
  requestValidationMiddleware({}),
  contextMiddleware(false),
  isUserAuthenticated,
  // logTimeMiddleWare,
  PlayerController.getRecentlyPlayedGames,
  responseValidationMiddleware({})
)

playerRouter
  .route('/get-all-bonus')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    PlayerController.getAllBonusList,
    responseValidationMiddleware()
  )

playerRouter
  .route('/kyc-callback')
  .post(
    requestValidationMiddleware(),
    contextMiddleware(true),
    PlayerController.kycCallback,
    responseValidationMiddleware()
  )

playerRouter
  .route('/referral')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isUserAuthenticated,
    PlayerController.getReferralBonusDetails,
    responseValidationMiddleware()
  )

// playerRouter
//   .route('/personal-bonus')
//   .post(
//     requestValidationMiddleware(),
//     contextMiddleware(true),
//     isUserAuthenticated,
//     PlayerController.createPersonalBonus,
//     responseValidationMiddleware()
//   )
//   .get(
//     requestValidationMiddleware(),
//     contextMiddleware(false),
//     isUserAuthenticated,
//     PlayerController.getPersonalBonus,
//     responseValidationMiddleware()
//   )

// playerRouter
//   .route('/claim-personal-bonus')
//   .post(
//     requestValidationMiddleware(),
//     contextMiddleware(true),
//     isUserAuthenticated,
//     PlayerController.claimPersonalBonus,
//     responseValidationMiddleware()
//   )

playerRouter.route('/apply-affiliate').post(
  requestValidationMiddleware(applyAffiliateSchemas),
  contextMiddleware(true),
  // isUserAuthenticated,
  PlayerController.applyAffiliate,
  responseValidationMiddleware()
)

playerRouter
  .route('/check-session')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isUserAuthenticated,
    PlayerController.checkUserSession,
    responseValidationMiddleware()
  )

playerRouter
  .route('/promotion-bonus')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isUserAuthenticated,
    PlayerController.getPromotionBonus,
    responseValidationMiddleware()
  )
  .post(
    requestValidationMiddleware(),
    isUserAuthenticated,
    // regionAllowedMiddleware,
    contextMiddleware(true),
    PlayerController.claimPromotionBonus,
    responseValidationMiddleware()
  )

playerRouter
  .route('/get-provider')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    PlayerController.getProvider,
    responseValidationMiddleware({})
  )

playerRouter
  .route('/promocode')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    PlayerController.checkAffiliatePromocode,
    responseValidationMiddleware({})
  )

playerRouter
  .route('/approveTermAndCondition') // for approve T&C
  .put(
    requestValidationMiddleware(termAndConditionSchemas),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.approveTermAndCondition,
    responseValidationMiddleware(termAndConditionSchemas)
  )

playerRouter
  .route('/fbData-delete-status')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    PlayerController.facebookDeleteStatus,
    responseValidationMiddleware({})
  )

playerRouter.route('/fbData-delete-callback').post(
  requestValidationMiddleware({}),
  contextMiddleware(true),
  // isUserAuthenticated,
  PlayerController.facebookDeleteCallback,
  responseValidationMiddleware({})
)

playerRouter.route('/getSpinList').get(
  requestValidationMiddleware({}),
  contextMiddleware(false),
  // isUserAuthenticated,
  PlayerController.getSpinWheelList,
  responseValidationMiddleware({})
)

playerRouter
  .route('/generateSpinIndex')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.generateSpinWheelIndex,
    responseValidationMiddleware({})
  )

playerRouter
  .route('/promo-code')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isUserAuthenticated,
    PlayerController.getPromocodeDetails,
    responseValidationMiddleware()
  )

playerRouter
  .route('/apply-promocode')
  .post(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.applyPromocode,
    responseValidationMiddleware()
  )

playerRouter
  .route('/referred-details')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isUserAuthenticated,
    PlayerController.getReferredUserDetails,
    responseValidationMiddleware()
  )

playerRouter
  .route('/referral-bonus')
  .post(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.claimReferralBonus,
    responseValidationMiddleware()
  )

playerRouter
  .route('/generate-otp-2fa')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.generate2faOtp,
    responseValidationMiddleware({})
  )

playerRouter
  .route('/verify-otp-2fa')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.verify2faOtp,
    responseValidationMiddleware({})
  )

playerRouter
  .route('/disable-auth')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.disableAuth,
    responseValidationMiddleware({})
  )
playerRouter
  .route('/setting-marketing')
  .put(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.settingMarketing,
    responseValidationMiddleware()
  )

playerRouter
  .route('/feedback')
  .post(
    requestValidationMiddleware(userFeedbackSchema),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.feedback,
    responseValidationMiddleware(userFeedbackSchema)
  )

playerRouter
  .route('/seon-kyc-webhook')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    PlayerController.KycSeonWebhook,
    responseValidationMiddleware({})
  )

playerRouter
  .route('/get-terms-conditions')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    PlayerController.getTermsAndConditions,
    responseValidationMiddleware({})
  )

playerRouter
  .route('/update-terms-conditions')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isUserAuthenticated,
    PlayerController.updateTermsAndCondition,
    responseValidationMiddleware({})
  )
export default playerRouter
