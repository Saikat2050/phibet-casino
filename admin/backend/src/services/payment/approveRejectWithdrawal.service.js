import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { LEDGER_PURPOSE, LEDGER_TRANSACTION_TYPE, SWEEPS_COINS, TRANSACTION_STATUS, WITHDRAWAL_STATUS } from '@src/utils/constants/public.constants.utils'
import { PAYMENT_PROVIDER } from '@src/utils/constants/payment.constants'
import _ from 'lodash'
import { CreateTransactionService } from '@src/services/common/createTransaction.service'
import { ApproveByApprovelyWithdrawalsService } from './withdrawalRequests/approveByApprovelyWithdrawal.service'
import { ApprovePayByBankWithdrawalsService } from './withdrawalRequests/approvePayByBankWithdrawal.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    adminUserId: { type: 'string' },
    withdrawalId: { type: 'string' },
    status: { enum: Object.values(WITHDRAWAL_STATUS) }
  },
  required: ['withdrawalId', 'status']
})

export class ApproveRejectWithdrawalsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { withdrawalId, status, userId, adminUserId } = this.args
    const transaction = this.context.sequelizeTransaction
    const {
      withdrawal: withdrawalModel,
      transaction: transactionModel,
      paymentProvider: paymentProviderModel
    } = this.context.sequelize.models

    try {
      const withdrawal = await withdrawalModel.findOne({ where: { id: withdrawalId, status: WITHDRAWAL_STATUS.PENDING, userId }, transaction })
      if (!withdrawal) return this.addError('WithdrawlNotExistErrorType')

      const withdrawalTransaction = await transactionModel.findOne({
        where: { id: withdrawal.transactionId, userId },
        include: {
          model: paymentProviderModel,
          attributes: ['id', 'name'],
          required: true
        },
        transaction
      })
      if (!withdrawalTransaction) return this.addError('TransactionNotExistErrorType')

      // if request is rejected
      if (status === WITHDRAWAL_STATUS.REJECTED) {
        const result = await CreateTransactionService.execute({
          userId: withdrawal.userId,
          purpose: LEDGER_PURPOSE.REDEEM_REJECTED,
          paymentId: withdrawalTransaction.paymentId,
          paymentProviderId: withdrawalTransaction.paymentProviderId,
          amount: withdrawal.amount,
          code: SWEEPS_COINS.RSC,
          ledgerTransactionType: LEDGER_TRANSACTION_TYPE.REDEEM
        }, this.context)
        if (_.size(result.errors)) return this.mergeErrors(result.errors)

        withdrawalTransaction.status = TRANSACTION_STATUS.REJECTED
        withdrawalTransaction.actioneeId = adminUserId
        await withdrawalTransaction.save({ transaction })

        withdrawal.status = status
        withdrawal.moreDetails = JSON.stringify({ rejectedTransactionId: result.result.id })
        await withdrawal.save({ transaction })
      } else if (status === WITHDRAWAL_STATUS.APPROVED) {
        // if approved then as per payment provider
        if (withdrawalTransaction.paymentProvider.name.EN === PAYMENT_PROVIDER.PAY_BY_BANK) {
          const result = await ApprovePayByBankWithdrawalsService.execute({ withdrawal: withdrawal, withdrawalTransaction: withdrawalTransaction }, this.context)
          if (_.size(result.errors)) return this.mergeErrors(result.errors)
        } else if (withdrawalTransaction.paymentProvider.name.EN === PAYMENT_PROVIDER.COINFLOW) {
          const result = await ApproveByApprovelyWithdrawalsService.execute({ withdrawal: withdrawal, withdrawalTransaction: withdrawalTransaction, adminUserId }, this.context)
          if (_.size(result.errors)) return this.mergeErrors(result.errors)
        }
      }

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
