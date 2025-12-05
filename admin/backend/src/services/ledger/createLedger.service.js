import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { ServiceBase } from '@src/libs/serviceBase'
import { emitUserWallet } from '@src/socket-resources/emitters/wallet.emitter'
import { LEDGER_TRANSACTION_TYPE, LEDGER_PURPOSE, LEDGER_RULES, LEDGER_TYPES } from '@src/utils/constants/public.constants.utils'
import { Transaction } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    amount: { type: 'number' },
    purpose: { enum: Object.values(LEDGER_PURPOSE) },
    walletId: { type: 'number' },
    walletType: { type: 'string' }, 
    currencyId: { type: 'string' },
    transactionType: { enum: Object.values(LEDGER_TRANSACTION_TYPE) },
    transactionId: { type: 'string' }
  },
  required: ['userId', 'walletId', 'purpose', 'amount', 'currencyId']
})

export class CreateLedgerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, purpose, amount, walletId, currencyId, walletType, transactionType, transactionId } = this.args
    const type = LEDGER_RULES[purpose]
    const transaction = this.context.sequelizeTransaction
    const WalletModel = this.context.sequelize.models.wallet
    const LedgerModel = this.context.sequelize.models.ledger
    try {
      const wallet = await WalletModel.findOne({ where: { id: walletId, userId }, lock: Transaction.LOCK.UPDATE, transaction })
      if (!wallet) throw new APIError('WalletNotFoundError')

      let key = 'amount'; 
      if (walletType === 'vault') {
        key = 'vaultAmount'; 
      }
       if (type === LEDGER_TYPES.CREDIT) {
         wallet[key] = NumberPrecision.plus(wallet[key], amount);
       } else if (wallet[key] < amount) {
          return this.addError('NotEnoughAmountErrorType');
      } else {
          wallet[key] = NumberPrecision.minus(wallet[key], amount);
      }

        
      const ledgerData = {
        purpose,
        walletType,
        amount,
        currencyId,
        transactionType,
        transactionId,
        [type === LEDGER_TYPES.CREDIT ? 'toWalletId' : 'fromWalletId']: wallet.id
      }
      await LedgerModel.create(ledgerData, { transaction })
      await wallet.save({ transaction })

      console.log('Wallet being emitted:', wallet.toJSON())

      emitUserWallet(userId, wallet)
      return ledgerData
    } catch (error) {
      throw new APIError(error.message || 'InternalServerError')
    }
  }
}
