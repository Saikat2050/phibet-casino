import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'
import { LEDGER_PURPOSE, WITHDRAWAL_STATUS } from '@src/utils/constants/public.constants.utils'
import { TRANSACTION_STATUS, APPROVELY_TRANSACTION_STATUS } from '@src/utils/constants/payment.constants'
import { PaymentTransactionService } from '../../../transaction/paymentTransaction.service'
import axios from 'axios'
import { ScaleoAxios } from '@src/libs/axios/scaleo.axios'

export class HandleWithdrawApprovelyTxnService extends ServiceBase {
  async run () {
    try {
      const { eventType, data } = this.args
      const transaction = this.context.sequelizeTransaction
      const { transaction: TransactionModel, withdrawal: WithdrawalModel , user: UserModel} = this.context.sequelize.models

      const transactionDetails = await TransactionModel.findOne({
        attributes: ['id', 'status', 'moreDetails', 'paymentId', 'paymentProviderId'],
        where: { paymentId: data?.signature },
        lock: { level: transaction.LOCK.UPDATE, of: TransactionModel },
        include: [{
          model: UserModel,
          attributes: ['affiliateCode', 'affiliateId']
        }],
        transaction
      })
      if (!transactionDetails) return { success: false, message: 'Transaction Not Found!' }

      const withdrawRequest = await WithdrawalModel.findOne({
        attributes: ['id', 'status', 'userId', 'amount', 'failedTransactionId'],
        where: { transactionId: transactionDetails?.id },
        lock: { level: transaction.LOCK.UPDATE, of: WithdrawalModel },
        transaction
      })

      if (!withdrawRequest) return { success: false, message: 'Withdrawal Request Not Found!' }

      if (transactionDetails?.status === TRANSACTION_STATUS.FAILED || withdrawRequest?.status === TRANSACTION_STATUS.COMPLETED) { return { success: false, message: 'Transaction Already Processed' } } // need to confirm

      const updateTransactionStatus = async (trnxStatus, withdrawStatus) => {
        withdrawRequest.status = withdrawStatus
        withdrawRequest.confirmedAt = Date.now()

        transactionDetails.status = trnxStatus
        const existingMoreDetails = transactionDetails?.moreDetails || {}
        transactionDetails.moreDetails = { ...existingMoreDetails, data }
        await Promise.all([withdrawRequest.save({ transaction }), transactionDetails.save({ transaction })])
      }

      if (eventType === APPROVELY_TRANSACTION_STATUS.WITHDRAW_SUCCESS) {
        await updateTransactionStatus(TRANSACTION_STATUS.COMPLETED, WITHDRAWAL_STATUS.APPROVED)

        if (transactionDetails?.user && transactionDetails?.user?.affiliateCode !== null) {
          await ScaleoAxios.sendEventData({
            timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            type: 'wdr',
            click_id: transactionDetails?.user?.affiliateCode.replaceAll('-', ''),
            adv_user_id: transactionDetails?.user?.id,
            amount: transactionDetails?.amount,
            currency: 'USD',
            event_id: transactionDetails.paymentId
          })
        }
      } else if (eventType === APPROVELY_TRANSACTION_STATUS.WITHDRAW_FAILED) {
        await updateTransactionStatus(TRANSACTION_STATUS.FAILED, WITHDRAWAL_STATUS.FAILED)

        // creating entry in transaction and ledger table for failed transaction
        const failedTxnId = await PaymentTransactionService.execute({
          userId: withdrawRequest?.userId,
          paymentId: transactionDetails?.paymentId,
          purpose: LEDGER_PURPOSE.REDEEEM_FAILED,
          amount: withdrawRequest?.amount,
          paymentProviderId: transactionDetails?.paymentProviderId,
          moreDetails: { data }
        }, this.context)

        withdrawRequest.failedTransactionId = failedTxnId?.result?.id
        await withdrawRequest.save({ transaction })
      }

      return { success: true, result: { success: true } }
    } catch (error) {
      this.context.logger.error(error)
      throw new APIError(error)
    }
  }
}
