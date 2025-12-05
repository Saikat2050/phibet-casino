import { decorateResponse } from '@src/helpers/response.helpers'
import { HandleApprovelyTxnService } from '@src/services/payment/approvely/callbacks/handleTransaction.service'
import { CreateApprovelyPurchaseTxnService } from '@src/services/payment/approvely/purchaseTransaction.service'
import { ApprovelyCreateBankService } from '@src/services/payment/approvely/createBankAccount.service'
import { ApprovelyGetWithdrawerService } from '@src/services/payment/approvely/getWithdrawer.service'
import { HandleWithdrawApprovelyTxnService } from '@src/services/payment/approvely/callbacks/handleWithdrawTransaction.service'
import { getIp } from '@src/utils'
import { approvelyPaymentGateWay } from '@src/configs/payment/approvely.config'
import { ApprovelyCreateDebitCardService } from '@src/services/payment/approvely/createDebitCard.service'

export class ApprovelyController {
  /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
  static async purchaseTransaction (req, res, next) {
    try {
      const result = await CreateApprovelyPurchaseTxnService.execute({ ...req.body, ipAddress: getIp(req) }, req.context)
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
  static async transactionCallback (req, res, next) {
    try {
      let result
      const webhookValidationKey = req.get('Authorization')
      if (webhookValidationKey !== `${approvelyPaymentGateWay.webhookValidationKey}`) {
        result = { result: { success: false, message: 'Invalid Webhook Validation Key!' }, success: true }
      } else if (req.body.category === 'Withdraw') result = await HandleWithdrawApprovelyTxnService.execute(req.body, req.context)
      else result = await HandleApprovelyTxnService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async approvelyCreateBank (req, res, next) {
    try {
      const result = await ApprovelyCreateBankService.execute({ userId: req.authenticated.userId, ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async approvelyGetWithdrawer (req, res, next) {
    try {
      const result = await ApprovelyGetWithdrawerService.execute({ userId: req.authenticated.userId, ...req.query }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async approvelyCreateDebitCard (req, res, next) {
    try {
      const result = await ApprovelyCreateDebitCardService.execute({ userId: req.authenticated.userId, ...req.body }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
