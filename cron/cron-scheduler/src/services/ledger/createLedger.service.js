import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { ServiceBase } from '@src/libs/serviceBase'
import { emitUserWallet } from '@src/socket-resources/emitters/wallet.emitter'
import { LEDGER_PURPOSE, LEDGER_RULES, LEDGER_TYPES } from '@src/utils/constants/public.constants.utils'
import { Transaction } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    amount: { type: 'number' },
    walletId: { type: 'string' },
    purpose: { enum: Object.values(LEDGER_PURPOSE) }
  },
  required: ['userId', 'walletId', 'purpose', 'amount']
})

export class CreateLedgerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const purpose = this.args.purpose
      const type = LEDGER_RULES[purpose]
      const amount = this.args.amount
      const userId = this.args.userId
      const transaction = this.context.sequelizeTransaction
      const WalletModel = this.context.sequelize.models.wallet
      const LedgerModel = this.context.sequelize.models.ledger
      let toWalletId = null
      let fromWalletId = null

      const wallet = await WalletModel.findOne({
        where: { id: this.args.walletId, userId },
        lock: Transaction.LOCK.UPDATE,
        transaction
      })

      if (!wallet) return this.addError('InvalidWalletIdErrorType')

      if (type === LEDGER_TYPES.CREDIT) {
        toWalletId = wallet.id
        wallet.amount = NumberPrecision.plus(wallet.amount, amount)
      } else if (type === LEDGER_TYPES.DEBIT) {
        if (amount > wallet.amount) return this.addError('NotEnoughAmountErrorType')
        fromWalletId = wallet.id
        wallet.amount = NumberPrecision.minus(wallet.amount, amount)
      }

      const ledger = await LedgerModel.create({
        type,
        userId,
        purpose,
        toWalletId,
        fromWalletId,
        currencyId: wallet.currencyId,
        amount: this.args.amount
      }, { transaction })

      await wallet.save({ transaction })
      emitUserWallet(wallet.userId, wallet)

      return ledger
    } catch (error) {
      throw new APIError(error)
    }
  }
}
