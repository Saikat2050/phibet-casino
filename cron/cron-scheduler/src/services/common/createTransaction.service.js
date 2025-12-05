import { ServiceBase } from '@src/libs/serviceBase'
import { sequelize } from '@src/database'
import { LEDGER_TRANSACTION_TYPE, TRANSACTION_STATUS } from '@src/utils/constants/payment.constants'
import { CreateLedgerService } from './createLedger.service'
import { APIError } from '@src/errors/api.error'
import _ from 'lodash'

export class CreateTransactionService extends ServiceBase {
  async run () {
    const { userId, purpose, paymentId, paymentProviderId, packageId, amount, wallet, moreDetails, transactionType } = this.args
    const transaction = this?.args?.seqTransaction || await sequelize.transaction()
    const transactionModel = sequelize.models.transaction

    try {
      const txn = await transactionModel.create({
        userId,
        status: TRANSACTION_STATUS.COMPLETED,
        moreDetails,
        ...(paymentId ? { paymentId } : {}),
        ...(paymentProviderId ? { paymentProviderId } : {}),
        ...(packageId ? { packageId } : {})
      }, { transaction })

      const result = await CreateLedgerService.execute({
        amount,
        walletId: wallet.id,
        userId,
        purpose,
        transactionId: txn.id,
        transactionType: transactionType || LEDGER_TRANSACTION_TYPE.STANDARD,
        seqTransaction: transaction
      })
      if (_.size(result.errors)) return this.mergeErrors(result.errors)

      if (!this?.args?.seqTransaction) await transaction.commit()

      return txn
    } catch (error) {
      await transaction.rollback()
      throw new APIError(error)
    }
  }
}
