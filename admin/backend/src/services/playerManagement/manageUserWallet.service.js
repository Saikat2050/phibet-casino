import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { LEDGER_PURPOSE, TRANSACTION_STATUS, LEDGER_TRANSACTION_TYPE } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { CreateLedgerService } from '../ledger/createLedger.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    purpose: { enum: [LEDGER_PURPOSE.ADD_COIN, LEDGER_PURPOSE.REMOVE_COIN] },
    userId: { type: 'string' },
    amount: { type: 'number', minimum: 0.01 },
    adminUserId: { type: 'string' },
    walletId: { type: 'number' },
    walletType: { type: 'string' }
  },
  required: ['purpose', 'amount', 'userId', 'adminUserId']
})

export class ManageUserWalletService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, purpose, amount, walletId, walletType } = this.args
    const transaction = this.context.sequelizeTransaction
    const transactionModel = this.context.sequelize.models.transaction
    const walletModel = this.context.sequelize.models.wallet

    try {
      // Fetch wallet with locking for concurrency control
      const wallet = await walletModel.findOne({
        where: { id: walletId },
        include: {
          attributes: ['code', 'type'],
          model: this.context.sequelize.models.currency
        },
        transaction
      })

      if (!wallet) return this.addError('WalletNotFoundError')
      // Create the transaction record
      const txn = await transactionModel.create({
        userId,
        status: TRANSACTION_STATUS.COMPLETED
      }, { transaction })

      // Create the ledger entry for this transaction
      const result = await CreateLedgerService.execute({
        amount,
        walletId: wallet.id,
        userId,
        walletType,
        purpose,
        transactionId: txn.id,
        currencyId: wallet.currencyId,
        transactionType: LEDGER_TRANSACTION_TYPE.STANDARD
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
