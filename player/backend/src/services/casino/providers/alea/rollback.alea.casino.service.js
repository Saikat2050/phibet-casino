import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CreateLedgerService } from '@src/services/ledger/createLedger.service'
import { CASINO_TRANSACTION_STATUS } from '@src/utils/constants/casinoManagement.constants'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'
import { CURRENCY_TYPES, LEDGER_PURPOSE, LEDGER_TRANSACTION_TYPE, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'
import { verifySignature } from './alea.helper'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { CACHE_STORE_SUFFIXES } from '@src/utils/constants/app.constants'
import { Logger } from '@src/libs/logger'

export class RollBackAleaCasinoService extends ServiceBase {
  async run () {
    const { id, casinoSessionId, transaction, player, currency, game, endRound } = this.args
    const dbTransaction = this.context.sequelizeTransaction
    const casinoTransactionModel = this.context.sequelize.models.casinoTransaction

    try {
      if (!endRound) {
        if (!verifySignature(this.args)) return ALEA_ERROR_TYPES.INVALID_SIGNATURE
      }

      // Fetch session details from cache
      const payload = await Cache.get(`alea_${casinoSessionId}`)
      if (!payload || (payload && !Object.keys(payload).length)) return ALEA_ERROR_TYPES.SESSION_EXPIRED

      const { userId, coin, gameId, uniqueGameId } = JSON.parse(payload)

      // Validate user ID
      if (!+userId) return ALEA_ERROR_TYPES.SESSION_EXPIRED

      if (String(game.id) !== String(uniqueGameId)) {
        await dbTransaction.rollback()
        return ALEA_ERROR_TYPES.ROLLBACK_GAME_NOT_FOUND
      }

      const [userIdFromPlayerId, coinFromPlayerId] = player.casinoPlayerId.split('_')

      if (+userId !== +userIdFromPlayerId || coin !== coinFromPlayerId) {
        await dbTransaction.rollback()
        return ALEA_ERROR_TYPES.PLAYER_NOT_FOUND
      }

      if (currency !== coin) {
        await dbTransaction.rollback()
        return ALEA_ERROR_TYPES.INVALID_CURRENCY
      }

      // Check if the transaction has already been processed
      const checkTransaction = await casinoTransactionModel.findOne({
        attributes: ['id', 'transactionId', 'status', 'roundId', 'gameId'],
        where: { transactionId: `${id}:rollback` },
        transaction: dbTransaction
      })

      if (checkTransaction) {
        const userWallet = await this.context.sequelize.models.wallet.findAll({
          where: { userId },
          include: {
            model: this.context.sequelize.models.currency,
            where: { type: coin === SWEEPS_COINS.GC ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN },
            attributes: [],
            required: true
          },
          attributes: ['amount'],
          lock: { level: dbTransaction.LOCK.UPDATE, of: this.context.sequelize.models.wallet },
          transaction: dbTransaction
        })
        const updatedBalance = userWallet.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0)

        return {
          statusCode: 200,
          realBalance: updatedBalance,
          bonusBalance: 0,
          isAlreadyProcessed: true
        }
      }

      // Fetch existing rollback transactions
      const checkRollbackTransaction = await casinoTransactionModel.findAll({
        attributes: ['id', 'transactionId', 'status', 'roundId', 'gameId'],
        where: { transactionId: { [Op.in]: [`${transaction.id}`, `${transaction.id}:bet`, `${transaction.id}:win`] } },
        include: {
          as: 'casinoLedger',
          model: this.context.sequelize.models.ledger
        },
        transaction: dbTransaction
      })

      if (!checkRollbackTransaction?.length) {
        await Cache.set(`${transaction.id}${CACHE_STORE_SUFFIXES.BET_ROLLBACK}`, { status: 'CANCELLED' }, 3600)

        const userWallet = await this.context.sequelize.models.wallet.findAll({
          where: { userId },
          include: {
            model: this.context.sequelize.models.currency,
            where: { type: coin === SWEEPS_COINS.GC ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN },
            attributes: [],
            required: true
          },
          lock: { level: dbTransaction.LOCK.UPDATE, of: this.context.sequelize.models.wallet },
          attributes: ['amount'],
          transaction: dbTransaction
        })
        const updatedBalance = userWallet.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0)

        return {
          statusCode: 200,
          realBalance: updatedBalance,
          bonusBalance: 0,
          isNotFound: true
        }
      }

      // Process each rollback transaction
      for (const txn of checkRollbackTransaction) {
        const ledgers = txn.casinoLedger
        const [casinoTransaction] = await casinoTransactionModel.findOrCreate({
          where: {
            userId,
            gameId,
            transactionId: `${id}:rollback`
          },
          defaults: {
            userId,
            gameId,
            transactionId: `${id}:rollback`,
            metaData: this.args,
            status: CASINO_TRANSACTION_STATUS.COMPLETED
          },
          transaction: dbTransaction
        })

        for (const ledger of ledgers) {
          await CreateLedgerService.execute({
            amount: ledger.amount,
            transactionType: LEDGER_TRANSACTION_TYPE.CASINO,
            walletId: ledger.purpose === LEDGER_PURPOSE.CASINO_BET ? ledger.fromWalletId : ledger.toWalletId,
            userId,
            purpose: ledger.purpose === LEDGER_PURPOSE.CASINO_BET
              ? LEDGER_PURPOSE.CASINO_BET_ROLLBACK
              : LEDGER_PURPOSE.CASINO_WIN_ROLLBACK,
            transactionId: casinoTransaction.id,
            currencyId: ledger.currencyId
          }, this.context)
        }
      }

      // Fetch and calculate the updated balance
      const updatedWallets = await this.context.sequelize.models.wallet.findAll({
        where: { userId },
        attributes: ['amount'],
        include: { model: this.context.sequelize.models.currency, where: { type: coin === SWEEPS_COINS.GC ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN }, attributes: [], required: true },
        transaction: dbTransaction
      })

      const updatedBalance = updatedWallets.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0)

      return {
        realBalance: updatedBalance,
        bonusBalance: 0.0
      }
    } catch (error) {
      Logger.error(`Error in Alea Play Rollback Service - ${error}`)
      if (!dbTransaction.finished) await dbTransaction.rollback()

      return ALEA_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
