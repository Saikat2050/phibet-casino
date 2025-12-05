import { sequelize } from '@src/database'
import { APIError } from '@src/errors/api.error'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { ServiceBase } from '@src/libs/serviceBase'
import { LEDGER_RULES, LEDGER_TYPES } from '@src/utils/constants/public.constants.utils'
import { Transaction } from 'sequelize'

export class CreateLedgerService extends ServiceBase {
  async run () {
    const { userId, purpose, amount, walletId, transactionType, transactionId } = this.args
    const type = LEDGER_RULES[purpose]
    const WalletModel = sequelize.models.wallet
    const LedgerModel = sequelize.models.ledger
    const transaction = this?.args?.seqTransaction || this.context.sequelizeTransaction || await sequelize.transaction()

    try {
      const wallet = await WalletModel.findOne({
        where: { id: walletId, userId },
        lock: Transaction.LOCK.UPDATE,
        transaction
      })
      if (!wallet) throw new APIError('WalletNotFoundError')

      if (type === LEDGER_TYPES.CREDIT) {
        wallet.amount = NumberPrecision.plus(wallet.amount, amount)
      } else if (wallet.amount < amount) {
        if (!this?.args?.seqTransaction) {
          await transaction.commit()
        }
        return this.addError('NotEnoughAmountErrorType')
      } else {
        wallet.amount = NumberPrecision.minus(wallet.amount, amount)
      }

      const ledgerData = {
        purpose,
        amount,
        currencyId: wallet.currencyId,
        transactionType,
        transactionId,
        [type === LEDGER_TYPES.CREDIT ? 'toWalletId' : 'fromWalletId']: wallet.id
      }

      await LedgerModel.create(ledgerData, { transaction })
      await wallet.save({ transaction })
      return ledgerData
    } catch (error) {
      throw new APIError(error.message || 'InternalServerError')
    }
  }
}
