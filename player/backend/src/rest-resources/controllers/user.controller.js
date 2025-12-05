import { decorateResponse } from '@src/helpers/response.helpers'
import { createSession, destroySession } from '@src/helpers/session.helper'
import { GetTransactionService } from '@src/services/transaction/getTransactions.service'
import { AddAddressService } from '@src/services/user/addAddress.service'
import { CheckUserService } from '@src/services/user/checkUser.service'
import { GetAddressesService } from '@src/services/user/getAddresses.service'
import { GetUserService } from '@src/services/user/getUser.service'
import { GetWalletsService } from '@src/services/user/getWallets.service'
import { LoginService } from '@src/services/user/login.service'
import { LogoutService } from '@src/services/user/logout.service'
import { RemoveAddressService } from '@src/services/user/removeAddress.service'
import { SignupService } from '@src/services/user/signup.service'
import { UpdateAddressService } from '@src/services/user/updateAddress.service'
import { UpdateSessionLimitService } from '@src/services/user/updateSessionLimit.service'
import { UpdateUserService } from '@src/services/user/updateUser.service'
import { UploadProfileImageService } from '@src/services/user/uploadProfileImage.service'
import { DepositService } from '@src/services/user/userDeposite.service'
import { getIp } from '@src/utils'
import { SetDefaultWalletService } from '@src/services/user/setDefaultWallet.service'
import { GetRecentGamesService } from '@src/services/user/getRecentGames.service'
import { GetReferredUserService } from '@src/services/user/getReferredUserDeatils.service'
import { GetAllUserService } from '@src/services/user/getUserList.service'
import { GetDefaultChatSettingsService } from '@src/services/user/getDefaultChatSettings.service'
import { GetVipTiersService } from '@src/services/vipSystem/getVipTiers.service'
import { GoogleSignUpLoginService } from '@src/services/user/googleSignUpLogin.service'
import { FacebookSignUpLoginService } from '@src/services/user/facebookSignupLogin.service'
import { GetReferralUserDetailsService } from '@src/services/user/getReferralUserDetails.service'
import { GenerateOtpService } from '@src/services/user/2fa/generateOtp.service'
import { VerifyOtpService } from '@src/services/user/2fa/verifyOtp.service'
import { EnableDisableAuthService } from '@src/services/user/2fa/disableAuth.service'
import { GetPromocodeDetailsService } from '@src/services/user/getpromocode.service'
import { ApplyPromocodeService } from '@src/services/user/applyPromocode.service'
import { AddPaymentCardService } from '@src/services/user/addPaymentCard.service'
import { UpdatePaymentCardService } from '@src/services/user/updatePaymentCard.service'
import { GetPaymentCardsService } from '@src/services/user/getPaymentCards.service'
import { GetPaymentCardDetailsService } from '@src/services/user/getPaymentCardDetails.service'
import { DeletePaymentCardService } from '@src/services/user/deletePaymentCard.service'

export class UserController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async signup (req, res, next) {
    try {
      const result = await SignupService.execute({ ...req.body, ipAddress: getIp(req) }, req.context)
      if (result.success) result.result.accessToken = await createSession(req, result.result.user.id, result.result.user.sessionLimit)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getUserList (req, res, next) {
    try {
      const result = await GetAllUserService.execute({ ...req.query, userId: req?.authenticated?.userId, ipAddress: getIp(req) }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getDefaultChatSettings (req, res, next) {
    try {
      const result = await GetDefaultChatSettingsService.execute({ ...req.query, ipAddress: getIp(req) }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async login (req, res, next) {
    try {
      const result = await LoginService.execute({ ...req.body, ipAddress: getIp(req) }, req.context)
      if (result.success) result.result.accessToken = await createSession(req, result.result.user.id, result.result.user.sessionLimit)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async logout (req, res, next) {
    try {
      const result = await LogoutService.execute({ userId: req.authenticated.userId }, req.context)
      destroySession(req)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async update (req, res, next) {
    try {
      const result = await UpdateUserService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getUser (req, res, next) {
    try {
      const result = await GetUserService.execute({ userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getWallets (req, res, next) {
    try {
      const result = await GetWalletsService.execute({ userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getTransactions (req, res, next) {
    try {
      const result = await GetTransactionService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getRecentGames (req, res, next) {
    try {
      const result = await GetRecentGamesService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async deposit (req, res, next) {
    try {
      const result = await DepositService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async updateSessionLimit (req, res, next) {
    try {
      const result = await UpdateSessionLimitService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getAddresses (req, res, next) {
    try {
      const result = await GetAddressesService.execute({ userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async addAddress (req, res, next) {
    try {
      const result = await AddAddressService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async removeAddress (req, res, next) {
    try {
      const result = await RemoveAddressService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async updateAddress (req, res, next) {
    try {
      const result = await UpdateAddressService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async checkUser (req, res, next) {
    try {
      const result = await CheckUserService.execute({ ...req.query }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async uploadProfileImage (req, res, next) {
    try {
      const result = await UploadProfileImageService.execute({ file: req.file, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async setDefaultWallet (req, res, next) {
    try {
      const result = await SetDefaultWalletService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
  static async getReferredUser (req, res, next) {
    try {
      const result = await GetReferredUserService.execute({ ...req.query, userId: req?.authenticated?.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async googleSignUpLogin (req, res, next) {
    try {
      const result = await GoogleSignUpLoginService.execute({ ...req.body, ipAddress: getIp(req) }, req.context)
      if (result.success) result.result.accessToken = await createSession(req, result.result.user.id, result.result.user.sessionLimit)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async facebookSignUpLogin (req, res, next) {
    try {
      const result = await FacebookSignUpLoginService.execute({ ...req.body, ipAddress: getIp(req) }, req.context)
      if (result.success) result.result.accessToken = await createSession(req, result.result.user.id, result.result.user.sessionLimit)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getReferralUserDetails (req, res, next) {
    try {
      const result = await GetReferralUserDetailsService.execute({ ...req.query, userId: req?.authenticated?.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
      /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getPromocodeDetails (req, res, next) {
    try {
      const result = await GetPromocodeDetailsService.execute({ ...req.query }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

     /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async applyPromocode (req, res, next) {
    try {
      // console.log('REQ BODY RECEIVED:', req.authenticated.userId)
      const result = await ApplyPromocodeService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

    /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async addPaymentCard (req, res, next) {
    try {
      const result = await AddPaymentCardService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      console.log("result of add card",result)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async updatePaymentCard (req, res, next) {
    try {
      const result = await UpdatePaymentCardService.execute({
        ...req.body,
        userId: req.authenticated.userId
      }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getPaymentCards (req, res, next) {
    try {
      const result = await GetPaymentCardsService.execute({ userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getPaymentCardDetails (req, res, next) {
    try {
      const result = await GetPaymentCardDetailsService.execute({
        cardId: req.query.cardId,
        userId: req.authenticated.userId
      }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async deletePaymentCard (req, res, next) {
    try {
      const result = await DeletePaymentCardService.execute({
        cardId: req.query.cardId,
        userId: req.authenticated.userId
      }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
export class VipController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getVipTiers (req, res, next) {
    try {
      const result = await GetVipTiersService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}

export class GoogleAuthenticatorController {
  static async generateOtp (req, res, next) {
    try {
      const result = await GenerateOtpService.execute({ userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async verifyOtp (req, res, next) {
    try {
      const result = await VerifyOtpService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async disableAuth (req, res, next) {
    try {
      const result = await EnableDisableAuthService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }




}
