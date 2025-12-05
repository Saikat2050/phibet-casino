import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { CreateLedgerService } from '@src/services/ledger/createLedger.service'
import { LEDGER_TRANSACTION_TYPE, LEDGER_PURPOSE, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    paymentId: { type: 'string' },
    paymentProviderId: { type: 'number' },
    packageId: { type: 'string' },
    code: { type: 'string' },
    amount: { type: 'number', min: 0.1 },
    moreDetails: { type: 'object' },
    purpose: { enum: Object.values(LEDGER_PURPOSE) },
    ledgerTransactionType: { enum: Object.values(LEDGER_TRANSACTION_TYPE), default: LEDGER_TRANSACTION_TYPE.STANDARD }
  },
  required: ['userId', 'purpose', 'amount', 'code', 'ledgerTransactionType']
})

export class CreateTransactionService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, purpose, paymentId, paymentProviderId, packageId, amount, code, moreDetails, ledgerTransactionType } = this.args
    const transaction = this.context.sequelizeTransaction
    const transactionModel = this.context.sequelize.models.transaction
    const walletModel = this.context.sequelize.models.wallet

    try {
      // Fetch wallet with locking for concurrency control
      const wallet = await walletModel.findOne({
        where: { userId },
        include: {
          attributes: ['code', 'type'],
          model: this.context.sequelize.models.currency,
          where: { code }
        },
        transaction
      })

      if (!wallet) return this.addError('WalletNotFoundError')
      // Create the transaction record
      const txn = await transactionModel.create({
        userId,
        status: TRANSACTION_STATUS.COMPLETED,
        moreDetails,
        ...(paymentId ? { paymentId } : {}),
        ...(paymentProviderId ? { paymentProviderId } : {}),
        ...(packageId ? { packageId } : {}),
        ...(amount ? { amount } : {})
      }, { transaction })

      // Create the ledger entry for this transaction
      const result = await CreateLedgerService.execute({
        amount,
        walletId: wallet.id,
        userId,
        purpose,
        transactionId: txn.id,
        currencyId: wallet.currencyId,
        transactionType: ledgerTransactionType
      }, this.context)

      if (_.size(result.errors)) return this.mergeErrors(result.errors)

      // Save updated wallet balance
      await wallet.save({ transaction })
      return txn
    } catch (error) {
      throw new APIError(error)
    }
  }
}
