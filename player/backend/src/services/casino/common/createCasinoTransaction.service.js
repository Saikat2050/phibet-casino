import ajv from '@src/libs/ajv'
import { Logger } from '@src/libs/logger'
import { NumberPrecision } from '@src/libs/numberPrecision'
import ServiceBase from '@src/libs/serviceBase'
import { CreateLedgerService } from '@src/services/ledger/createLedger.service'
import { emitCasinoTransaction } from '@src/socket-resources/emitters/transaction.emitter'
import { CASINO_TRANSACTION_STATUS } from '@src/utils/constants/casinoManagement.constants'
import { CURRENCY_TYPES, LEDGER_PURPOSE, LEDGER_TRANSACTION_TYPE, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'

const transactionSchema = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    amount: { type: 'number' },
    gameId: { type: 'string' },
    currencyType: { enum: Object.values(CURRENCY_TYPES) },
    transactionId: { type: 'string' },
    roundId: { type: 'string' },
    wallet: { type: ['array', 'null'] },
    purpose: { enum: Object.values(LEDGER_PURPOSE) },
    metaData: { type: ['object', 'string'] }
  },
  required: ['userId', 'transactionId', 'purpose', 'amount', 'currencyType']
})

export class CreateCasinoTransactionService extends ServiceBase {
  get constraints () {
    return transactionSchema
  }

  async run () {
    const { userId, gameId, currencyType, amount, transactionId, roundId, metaData, purpose, wallet } = this.args
    const transaction = this.context.sequelizeTransaction
    const casinoTransactionModel = this.context.sequelize.models.casinoTransaction
    let wallets

    try {
      // Fetch user wallets
      if (wallet && wallet?.length) wallets = wallet
      else {
        wallets = await this.context.sequelize.models.wallet.findAll({
          where: { userId },
          include: {
            model: this.context.sequelize.models.currency,
            attributes: ['code', 'type'],
            where: { type: currencyType },
            required: true
          },
          lock: { level: transaction.LOCK.UPDATE, of: this.context.sequelize.models.wallet },
          transaction
        })
      }

      // Calculate total balance
      const totalBalance = wallets.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0)
      if (totalBalance < amount && purpose === LEDGER_PURPOSE.CASINO_BET) {
        return this.addError('NotEnoughAmountErrorType')
      }

      // Create casino transaction
      const casinoTransaction = await casinoTransactionModel.create({
        userId, gameId, transactionId, roundId, metaData, status: CASINO_TRANSACTION_STATUS.COMPLETED
      }, { transaction })

      const isGameCoin = currencyType === CURRENCY_TYPES.GOLD_COIN

      if (isGameCoin) {
        const { errors } = await CreateLedgerService.execute({
          amount,
          walletId: wallets[0].id,
          wallet: wallets[0],
          userId,
          purpose,
          transactionId: casinoTransaction.id,
          currencyId: wallets[0].currencyId,
          transactionType: LEDGER_TRANSACTION_TYPE.CASINO
        }, this.context)
        if (_.size(errors)) return this.mergeErrors(errors)
      } else {
        let remainingAmount = amount
        if (purpose === LEDGER_PURPOSE.CASINO_BET) {
          const walletOrder = [SWEEPS_COINS.BSC, SWEEPS_COINS.PSC, SWEEPS_COINS.RSC]
          for (const currencyCode of walletOrder) {
            const wallet = wallets.find(w => w.currency.code === currencyCode)
            if (wallet && remainingAmount > 0) {
              const deductionAmount = Math.min(remainingAmount, wallet.amount)
              if (deductionAmount > 0) {
                const { errors } = await CreateLedgerService.execute({
                  amount: deductionAmount, transactionType: LEDGER_TRANSACTION_TYPE.CASINO, wallet, walletId: wallet.id, userId, purpose, transactionId: casinoTransaction.id, currencyId: wallet.currencyId
                }, this.context)
                if (_.size(errors)) return this.mergeErrors(errors)
                remainingAmount = NumberPrecision.minus(remainingAmount, deductionAmount)
              }
              if (remainingAmount <= 0) break
            }
          }
        }
        if (remainingAmount >= 0 && purpose === LEDGER_PURPOSE.CASINO_WIN) {
          const wscWallet = wallets.find(w => w.currency.code === SWEEPS_COINS.RSC)
          const { errors } = await CreateLedgerService.execute({
            amount: remainingAmount, walletId: wscWallet.id, wallet: wscWallet, transactionType: LEDGER_TRANSACTION_TYPE.CASINO, userId, purpose, transactionId: casinoTransaction.id, currencyId: wscWallet.currencyId
          }, this.context)
          if (_.size(errors)) return this.mergeErrors(errors)
        }
      }

      // Fetch updated wallets
      const updatedWallets = await this.context.sequelize.models.wallet.findAll({
        where: { userId },
        attributes: ['amount'],
        include: { model: this.context.sequelize.models.currency, where: { type: currencyType }, attributes: [] },
        transaction
      })
      const updatedBalance = updatedWallets.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0)

      emitCasinoTransaction(casinoTransaction)
      return { casinoTransaction, updatedBalance }
    } catch (error) {
      Logger.error(error)
      return this.addError('InternalServerErrorType')
    }
  }
}
