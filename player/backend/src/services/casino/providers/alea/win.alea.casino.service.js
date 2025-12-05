import _ from 'lodash'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'
import { CreateCasinoTransactionService } from '../../common/createCasinoTransaction.service'
import { CURRENCY_TYPES, LEDGER_PURPOSE, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import { verifySignature } from './alea.helper'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { Logger } from '@src/libs/logger'

export class WinAleaCasinoService extends ServiceBase {
  async run () {
    const { amount, currency, id, casinoSessionId, game, round, player, endRound } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      if (+amount < 0) return ALEA_ERROR_TYPES.UNKNOWN_ERROR
      if (!endRound) {
        if (!verifySignature(this.args)) return ALEA_ERROR_TYPES.INVALID_SIGNATURE
      }

      const payload = await Cache.get(`alea_${casinoSessionId}`)
      if (!payload || (payload && !Object.keys(payload).length)) return ALEA_ERROR_TYPES.SESSION_EXPIRED

      const { userId, coin, gameId, uniqueGameId } = JSON.parse(payload)
      if (!Object.keys(payload).length) return ALEA_ERROR_TYPES.SESSION_EXPIRED

      if (!userId) {
        await transaction.rollback()
        return ALEA_ERROR_TYPES.SESSION_EXPIRED
      }

      if (String(game.id) !== String(uniqueGameId)) {
        await transaction.rollback()
        return ALEA_ERROR_TYPES.WIN_GAME_NOT_FOUND
      }

      const [userIdFromPlayerId, coinFromPlayerId] = player.casinoPlayerId.split('_')

      if (+userId !== +userIdFromPlayerId || coin !== coinFromPlayerId) {
        await transaction.rollback()
        return ALEA_ERROR_TYPES.PLAYER_NOT_FOUND
      }

      if (currency !== coin) {
        await transaction.rollback()
        return ALEA_ERROR_TYPES.INVALID_CURRENCY
      }

      const checkTransaction = await this.context.sequelize.models.casinoTransaction.findAll({
        where: {
          userId,
          roundId: round.id
        },
        attributes: ['transactionId'],
        transaction
      })

      if (!checkTransaction?.length) {
        return ALEA_ERROR_TYPES.UNKNOWN_ERROR
      } else {
        if (checkTransaction[1]?.transactionId === id + '') { // check transaction id of win transaction
          const userWallet = await this.context.sequelize.models.wallet.findAll({
            where: { userId },
            include: {
              model: this.context.sequelize.models.currency,
              where: { type: coin === SWEEPS_COINS.GC ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN },
              attributes: [],
              required: true
            },
            attributes: ['amount'],
            lock: { level: transaction.LOCK.UPDATE, of: this.context.sequelize.models.wallet },
            transaction
          })
          const updatedBalance = userWallet.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0)

          return {
            statusCode: 200,
            realBalance: updatedBalance,
            bonusBalance: 0,
            realAmount: amount,
            bonusAmount: 0.0,
            isAlreadyProcessed: true
          }
        }
      }
      const result = await CreateCasinoTransactionService.execute({
        userId,
        amount,
        gameId,
        currencyType: coin === SWEEPS_COINS.GC ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN,
        transactionId: id,
        roundId: round.id,
        purpose: LEDGER_PURPOSE.CASINO_WIN,
        metaData: this.args
      }, this.context)

      if (!_.isEmpty(result.errors)) return this.mergeErrors(result.errors)

      return {
        id: result.result.casinoTransaction.id,
        // transactionId: betTransaction?.transactionId, // Only for testing purposes
        realBalance: result.result.updatedBalance,
        bonusBalance: 0.0,
        realAmount: amount,
        bonusAmount: 0.0
      }
    } catch (error) {
      Logger.error(`Error in Alea Play Win Transaction - ${error}`)
      const transactionStatuses = ['commit', 'rollback']
      if (!(~transactionStatuses.indexOf(transaction.finished))) { await transaction.rollback() }
      return ALEA_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
