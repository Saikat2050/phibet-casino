import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { Logger } from '@src/libs/logger'
import ServiceBase from '@src/libs/serviceBase'
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
    wallet: { type: 'object' },
    currencyId: { type: ['string', 'null'] },
    purpose: { enum: Object.values(LEDGER_PURPOSE) },
    vaultAmount: { type: 'number' },
    ledgerAmount: { type: ['number' || null] }
  },
  required: ['userId', 'purpose', 'amount', 'code']
})

export class CreateTransactionService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, purpose, paymentId, paymentProviderId, packageId, amount, moreDetails, currencyId, wallet, vaultAmount, ledgerAmount } = this.args
    const transaction = this.context.sequelizeTransaction
    const transactionModel = this.context.sequelize.models.transaction

    try {
      // Create the transaction record
      const txn = await transactionModel.create({
        userId,
        status: TRANSACTION_STATUS.COMPLETED,
        moreDetails,
        ...(paymentId ? { paymentId } : {}),
        ...(paymentProviderId ? { paymentProviderId } : {}),
        ...(packageId ? { packageId } : {})
      }, { transaction })

      // Create the ledger entry for this transaction
      const result = await CreateLedgerService.execute({
        amount,
        walletId: wallet.id,
        userId,
        purpose,
        transactionId: txn.id,
        currencyId,
        transactionType: LEDGER_TRANSACTION_TYPE.STANDARD,
        vaultAmount,
        ledgerAmount
      }, this.context)

      if (_.size(result.errors)) return this.mergeErrors(result.errors)

      return txn
    } catch (error) {
      Logger.error(`Error in Create Transaction Service - ${error}`)
      throw new APIError(error)
    }
  }
}
