import { getClientIp } from '../../utils/common'
import { sendResponse } from '../../utils/response.helpers'
import { CancelRedeemRequestService, GetRedeemRequestsService, GetTransactionDetailService, GetTransactionsService, InitPaymentService, UpdateBonusWinTransactionService, UpdateRedeemRequestService } from '../../services/payment'
import { GetVaultDetailService, VaultDepositRequestService, VaultWithdrawRequestService } from '../../services/payment/vaultCoins'
import { PayByBankUserBankAccountDetailsService } from '../../services/payment/payByBank/userBankAccountDetails.service'
import { PayByBankInitiateBankAccountRegistrationService } from '../../services/payment/payByBank/initiateBankAccountRegistration.service'
import PaySafeDepositCallbackService from '../../services/payment/paysafe/paysafeDepositCallback.service'
import ApprovelyDepositCallbackService from '../../services/payment/approvely/approvelyPurchaseCallback.service'
import PushcashDepositCallbackService from '../../services/payment/pushcash/pushcashPurchaseCallback.service'
import { ApplyPromocodeService } from '../../services/player/applyPromocode.service'
import { RemovePromocodeService } from '../../services/payment/promocode/removePromocode.service'
import { SendDepositEventService } from '../../services/payment/sendDepositEventsToSokul.service'
import { SendWithdrawEventService } from '../../services/payment/sendWithdrawEventsToSokul.service'
import { GetAllPaymentProviderService } from '../../services/payment/getAllPaymentProvider.service'
import CreatePaymentInstrument from '../../services/payment/finix/createPaymentInstrument'
import ApplePaySessionsService from '../../services/payment/finix/applePaySessions.service'
import ApplePayIdentityService from '../../services/payment/finix/applePayIdentity.service'
export default class PaymentController {
  static async initPay (req, res, next) {
    try {
      const { result, successful, errors } = await InitPaymentService.execute({ ...req.query, ...req.body, ipAddress: getClientIp(req) }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getTransactions (req, res, next) {
    try {
      const { result, successful, errors } = await GetTransactionsService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateBonusWinTransaction (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateBonusWinTransactionService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async sendDepositEvents (req, res, next) {
    try {
      const { result, successful, errors } = await SendDepositEventService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async sendWithdrawEvents (req, res, next) {
    try {
      const { result, successful, errors } = await SendWithdrawEventService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRedeemRequests (req, res, next) {
    try {
      const { result, successful, errors } = await GetRedeemRequestsService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async cancelRedeemRequests (req, res, next) {
    try {
      const { result, successful, errors } = await CancelRedeemRequestService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updatePaysafeStatus (req, res, next) {
    try {
      const { result, successful, errors } = await PaySafeDepositCallbackService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateApprovelyStatus (req, res, next) {
    try {
      const { result, successful, errors } = await ApprovelyDepositCallbackService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updatePushcashStatus (req, res, next) {
    try {
      const { result, successful, errors } = await PushcashDepositCallbackService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateRedeemRequests (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateRedeemRequestService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getTransactionDetail (req, res, next) {
    try {
      const { result, successful, errors } = await GetTransactionDetailService.execute({ ...req.params }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async vaultDepositRequests (req, res, next) {
    try {
      const { result, successful, errors } = await VaultDepositRequestService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async vaultWithdrawRequests (req, res, next) {
    try {
      const { result, successful, errors } = await VaultWithdrawRequestService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getVaultDetail (req, res, next) {
    try {
      const { result, successful, errors } = await GetVaultDetailService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUserBankAccountDetails (req, res, next) {
    try {
      const { result, successful, errors } = await PayByBankUserBankAccountDetailsService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async initiateBankAccountRegistration (req, res, next) {
    try {
      const { result, successful, errors } = await PayByBankInitiateBankAccountRegistrationService.execute({ ...req.query, ...req.body }, req.context)
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

  static async removePromocode (req, res, next) {
    try {
      const { result, successful, errors } = await RemovePromocodeService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllPaymentProvider (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllPaymentProviderService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createPaymentInstrument (req, res, next) {
    try {
      const { result, successful, errors } = await CreatePaymentInstrument.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async applePaySessions (req, res, next) {
    try {
      const { result, successful, errors } = await ApplePaySessionsService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async applePayMerchantInfo (req, res, next) {
    try {
      const { result, successful, errors } = await ApplePayIdentityService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
