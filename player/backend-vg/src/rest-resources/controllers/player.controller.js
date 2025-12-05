import { sendAccessTokenResponse, sendResponse } from '../../utils/response.helpers'
import { liveLogoutUser, getClientIp } from '../../utils/common'
import socketServer from '../../libs/socketServer'
import { UserActivityService } from '../../services/player/userActivity.service'
import { ClaimWelcomeBonusService, GetWelcomeBonusService, GetAllBonusService, ClaimBonusServiceV2, GetDailyBonusServiceV2, GetPromotionBonusService, ClaimPromotionBonusService, CheckAffiliatePromocodeService, AwardReferralBonusService } from '../../services/player/bonus'
import { UserProfileService } from '../../services/player/userProfile.service'
import { UpdateProfileService } from '../../services/player/updateProfile.service'
import { GetPackagesService } from '../../services/player/getPackages.service'
import { GetCmsService } from '../../services/player/getCms.service'
import { GetCityService } from '../../services/player/getCity.service'
import { GetStateService } from '../../services/player/getState.service'
import { GetCmsDetailService } from '../../services/player/getCmsDetail.service'
import { GetCasinoGamesService } from '../../services/player/getCasinoGames.service'
import { GetSubCategoryService } from '../../services/player/getSubCategory.service'
import { GetCategoriesService } from '../../services/player/getCategories.service'
import { LaunchGameService } from '../../services/player/launchGame.service'
import { GetBetsService } from '../../services/player/bet/index'
import { USER_ACTIVITIES_TYPE } from '../../utils/constants/constant'
import { GetFavoriteGamesService } from '../../services/player/getFavoriteGames.service'
import { FavoriteService } from '../../services/player/favorite.service'
import { UpdateSelfProfileService } from '../../services/player/updateSelfProfile.service'
import { UpdateResponsibleGambling } from '../../services/player/updateResponsibleGambling.service'
import { GetBannersService } from '../../services/player/getBanners.service'
import { CreatePostalCodeService, GetPostalCodeService } from '../../services/player/postalCode/index'
import { GetResponsibleGamblingSetting } from '../../services/getResponsibleGamblingSetting'
import { RemoveResponsibleGamingService } from '../../services/player/removeResponsibleGaming'
import GetLiveWinnersService from '../../services/player/getLiveWinnerService'
import GetRecentlyPlayedGames from '../../services/player/getRecentlyPlayedGames'
import { GetResponsibleGambling } from '../../services/player/getResponsibleGambling.service'
import UploadProfileImage from '../../services/player/uploadProfileImage'
import { PlayerSignUpService, VerifyEmailService, LoginService, ChangePasswordService, ForgetPasswordService, VerifyForgetPasswordService, SendPhoneVerificationCodeService, ResendVerificationEmailService, UserNameCheckService, AppleLoginService, GoogleLoginService, AddUserNameService, FacebookLoginService, VerifyPhoneOTPCodeService } from '../../services/player/authentication'
import GetReferralBonusDetailService from '../../services/player/getReferralBonusDetails.service'
import { CreatePersonalBonusService, ClaimPersonalBonusService, GetPersonalBonusService } from '../../services/player/personalBonus'
import ApplyAffiliateService from '../../services/player/applyAffiliates.service'
import { GetProviderService } from '../../services/player/getProvider.service'
import { ApproveTermAndConditionService } from '../../services/player/approveTermAndCondition.service'
import { DeletionStatusService } from '../../services/player/authentication/facebookCallback/deletionStatus.service'
import { FacebookDataDeletionService } from '../../services/player/authentication/facebookCallback/fbDataDeletion.service'
import { GenerateSpinService, GetSpinWheelListService } from '../../services/wheelDivisionConfig'
import { GetPromocodeDetailsService } from '../../services/player/getpromocode.service'
import { ApplyPromocodeService } from '../../services/player/applyPromocode.service'
import { GetReferredUserDetailsService } from '../../services/player/getReferredUserDetails.service'
import { Generate2FAOtpService, DisableAuthService, Verify2FAOtpService } from '../../services/2fa'
import { UserMarketingService } from '../../services/player/userMarketing.service'
import { InitKycService, KycVerificationCallbackService } from '../../services/player/kyc'
import { UpdateEmailService } from '../../services/player/updateEmail.service'
import { UserFeedbackService } from '../../services/player/userFeedback.service'
import SignupAllowedService from '../../services/player/signjupAllowed.service'
import { KycSeonWebhookService } from '../../services/player/kyc/kycSeonWebhook.service'
import { GetActiveTermsAndConditions } from '../../services/player/getTermsAndCondition.service'
import { UpdateTermsAndConditions } from '../../services/player/updateTermsAndConditions.service'

/**
 * Demo Controller for handling all the request of /demo path
 *
 * @export
 * @class DemoController
 */
export default class PlayerController {
  /**
     * Controller method to handle the request for /hello path
     *
     * @static
     * @param {object} req - object contains all the request params sent from the client
     * @param {object} res - object contains all the response params sent to the client
     * @param {function} next - function to execute next middleware
     * @memberof PlayerController
     */

  static async userNameCheck (req, res, next) {
    try {
      const { result, successful, errors } = await UserNameCheckService.execute({ ...req.query, ipAddress: getClientIp(req) }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async addUserName (req, res, next) {
    try {
      const { result, successful, errors } = await AddUserNameService.execute({ ...req.body, ipAddress: getClientIp(req) }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async playerSignUp (req, res, next) {
    try {
      const { result, successful, errors } = await PlayerSignUpService.execute({ ...req.body, ipAddress: getClientIp(req) }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async verifyEmail (req, res, next) {
    try {
      const { result, successful, errors } = await VerifyEmailService.execute(req.body, req.context)
      sendAccessTokenResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateEmail (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateEmailService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async verifyOtp (req, res, next) {
    try {
      const { result, successful, errors } = await VerifyPhoneOTPCodeService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async resendVerificationMail (req, res, next) {
    try {
      const { result, successful, errors } = await ResendVerificationEmailService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async userLogin (req, res, next) {
    try {
      req.body.email = req.body.email.toLowerCase().replace(/\+(.*?)@/g, '@')
      const { result, successful, errors } = await LoginService.execute(req.body, req.context)
      sendAccessTokenResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async googleLogin (req, res, next) {
    try {
      const { result, successful, errors } = await GoogleLoginService.execute({ ...req.body, ipAddress: getClientIp(req) }, req.context)
      sendAccessTokenResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async facebookLogin (req, res, next) {
    try {
      const { result, successful, errors } = await FacebookLoginService.execute({ ...req.body, ipAddress: getClientIp(req) }, req.context)
      sendAccessTokenResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async appleLogin (req, res, next) {
    try {
      const { result, successful, errors } = await AppleLoginService.execute({ ...req.body, ipAddress: getClientIp(req) }, req.context)
      sendAccessTokenResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async changePassword (req, res, next) {
    try {
      const { result, successful, errors } = await ChangePasswordService.execute({ ...req.body, res: res }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async forgetPassword (req, res, next) {
    try {
      const { result, successful, errors } = await ForgetPasswordService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async verifyForgetPassword (req, res, next) {
    try {
      const { result, successful, errors } = await VerifyForgetPasswordService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async userLogout (req, res, next) {
    await socketServer.redisClient.del(`user:${req.body.uniqueId}`)
    await socketServer.redisClient.del(`gamePlay-${req.body.uniqueId}`)
    res.cookie('accessToken', '', { expires: new Date(0) })
    liveLogoutUser(req.body.user)

    await UserActivityService.execute({ activityType: USER_ACTIVITIES_TYPE.LOGOUT, userId: req.body.user?.userId, ipAddress: getClientIp(req) }, req.context)
    sendResponse({ req, res, next }, { result: { success: true }, successful: true, serviceErrors: {} })
  }

  static async accessAllow (req, res, next) {
    sendResponse({ req, res, next }, { result: { success: true, status: 200 }, successful: true, serviceErrors: {} })
  }

  static async signupAllowed (req, res, next) {
    try {
      const { result, successful, errors } = await SignupAllowedService.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getDailyBonus (req, res, next) {
    try {
      const { result, successful, errors } = await GetDailyBonusServiceV2.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getWelcomeBonus (req, res, next) {
    try {
      const { result, successful, errors } = await GetWelcomeBonusService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async claimWelcomeBonus (req, res, next) {
    try {
      const { result, successful, errors } = await ClaimWelcomeBonusService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async claimDailyBonus (req, res, next) {
    try {
      const { result, successful, errors } = await ClaimBonusServiceV2.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async userProfile (req, res, next) {
    try {
      const { result, successful, errors } = await UserProfileService.execute(req.body, req.context)
      if (result.data && result.data.dataValues) {
        result.data.dataValues.clientIP = getClientIp(req)
      }
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async responsibleGamblingHistory (req, res, next) {
    try {
      const { result, successful, errors } = await GetResponsibleGambling.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getResponsibleGambling (req, res, next) {
    try {
      try {
        const { result, successful, errors } = await GetResponsibleGamblingSetting.execute(req.query, req.context)
        sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
      } catch (error) {
        next(error)
      }
    } catch (error) {
      next(error)
    }
  }

  static async updateProfile (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateProfileService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async responsibleGambling (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateResponsibleGambling.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateSelfProfile (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateSelfProfileService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async sendOTP (req, res, next) {
    try {
      const { result, successful, errors } = await SendPhoneVerificationCodeService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPackages (req, res, next) {
    try {
      const { result, successful, errors } = await GetPackagesService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getCMS (req, res, next) {
    try {
      const { result, successful, errors } = await GetCmsService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getCMSDetail (req, res, next) {
    try {
      const { result, successful, errors } = await GetCmsDetailService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getGames (req, res, next) {
    try {
      const { result, successful, errors } = await GetCasinoGamesService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getSubCategory (req, res, next) {
    try {
      const { result, successful, errors } = await GetSubCategoryService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getCategories (req, res, next) {
    try {
      const { result, successful, errors } = await GetCategoriesService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async launchGame (req, res, next) {
    try {
      const { result, successful, errors } = await LaunchGameService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async launchDemoGame (req, res, next) {
    try {
      const { result, successful, errors } = await LaunchGameService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getBets (req, res, next) {
    try {
      const { result, successful, errors } = await GetBetsService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getFavoriteGame (req, res, next) {
    try {
      const { result, successful, errors } = await GetFavoriteGamesService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async favoriteGame (req, res, next) {
    try {
      const { result, successful, errors } = await FavoriteService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getState (req, res, next) {
    try {
      const { result, successful, errors } = await GetStateService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getCity (req, res, next) {
    try {
      const { result, successful, errors } = await GetCityService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getBanners (req, res, next) {
    try {
      const { result, successful, errors } = await GetBannersService.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createPostalCode (req, res, next) {
    try {
      const { result, successful, errors } = await CreatePostalCodeService.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPostalCode (req, res, next) {
    try {
      const { result, successful, errors } = await GetPostalCodeService.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async initKYC (req, res, next) {
    try {
      const { result, successful, errors } = await InitKycService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async removeResponsibleGamingSetting (req, res, next) {
    try {
      const { result, successful, errors } = await RemoveResponsibleGamingService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getLiveWinners (req, res, next) {
    try {
      const { result, successful, errors } = await GetLiveWinnersService.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRecentlyPlayedGames (req, res, next) {
    try {
      const { result, successful, errors } = await GetRecentlyPlayedGames.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async uploadUserProfileImage (req, res, next) {
    try {
      const { result, successful, errors } = await UploadProfileImage.execute({ ...req.body, document: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllBonusList (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllBonusService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async kycCallback (req, res, next) {
    try {
      const { result, successful, errors } = await KycVerificationCallbackService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createPersonalBonus (req, res, next) {
    try {
      const { result, successful, errors } = await CreatePersonalBonusService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async claimPersonalBonus (req, res, next) {
    try {
      const { result, successful, errors } = await ClaimPersonalBonusService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPersonalBonus (req, res, next) {
    try {
      const { result, successful, errors } = await GetPersonalBonusService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getReferralBonusDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetReferralBonusDetailService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async applyAffiliate (req, res, next) {
    try {
      const { result, successful, errors } = await ApplyAffiliateService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async checkUserSession (req, res, next) {
    sendResponse({ req, res, next }, { result: { success: true, status: 200 }, successful: true, serviceErrors: {} })
  }

  static async getPromotionBonus (req, res, next) {
    try {
      const { result, successful, errors } = await GetPromotionBonusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async claimPromotionBonus (req, res, next) {
    try {
      const { result, successful, errors } = await ClaimPromotionBonusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getProvider (req, res, next) {
    try {
      const { result, successful, errors } = await GetProviderService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async checkAffiliatePromocode (req, res, next) {
    try {
      const { result, successful, errors } = await CheckAffiliatePromocodeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async approveTermAndCondition (req, res, next) {
    try {
      const { result, successful, errors } = await ApproveTermAndConditionService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async facebookDeleteStatus (req, res, next) {
    try {
      const { result, successful, errors } = await DeletionStatusService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async facebookDeleteCallback (req, res, next) {
    try {
      const { result, successful, errors } = await FacebookDataDeletionService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getSpinWheelList (req, res, next) {
    try {
      const { result, successful, errors } = await GetSpinWheelListService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async generateSpinWheelIndex (req, res, next) {
    try {
      const { result, successful, errors } = await GenerateSpinService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPromocodeDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetPromocodeDetailsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async applyPromocode (req, res, next) {
    try {
      const { result, successful, errors } = await ApplyPromocodeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getReferredUserDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetReferredUserDetailsService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async claimReferralBonus (req, res, next) {
    try {
      const { result, successful, errors } = await AwardReferralBonusService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async generate2faOtp (req, res, next) {
    try {
      const { result, successful, errors } = await Generate2FAOtpService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async verify2faOtp (req, res, next) {
    try {
      const { result, successful, errors } = await Verify2FAOtpService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async disableAuth (req, res, next) {
    try {
      const { result, successful, errors } = await DisableAuthService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async settingMarketing (req, res, next) {
    try {
      const { result, successful, errors } = await UserMarketingService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async feedback (req, res, next) {
    try {
      const { result, successful, errors } = await UserFeedbackService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async KycSeonWebhook (req, res, next) {
    try {
      const { result, successful, errors } = await KycSeonWebhookService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getTermsAndConditions (req, res, next) {
    try {
      const { result, successful, errors } = await GetActiveTermsAndConditions.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateTermsAndCondition (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateTermsAndConditions.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
