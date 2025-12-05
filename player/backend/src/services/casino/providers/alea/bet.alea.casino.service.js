import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CASINO_TRANSACTION_STATUS } from '@src/utils/constants/casinoManagement.constants'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'
import { CURRENCY_TYPES, LEDGER_PURPOSE, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { CreateCasinoTransactionService } from '../../common/createCasinoTransaction.service'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { UserLevelUpgradeService } from '../../common/userLevelUpgrade.service'
import { verifySignature } from './alea.helper'
import { Logger } from '@src/libs/logger'
import { CACHE_STORE_SUFFIXES } from '@src/utils/constants/app.constants'

export class BetAleaCasinoService extends ServiceBase {
  async run () {
    const { id, game, currency, player, casinoSessionId, round, amount, endRound } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      if (+amount < 0) return ALEA_ERROR_TYPES.TRANSACTION_ALREADY_PROCESSED
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
        return ALEA_ERROR_TYPES.BET_GAME_NOT_FOUND
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

      const gotRolledBack = await Cache.get(`${id}${CACHE_STORE_SUFFIXES.BET_ROLLBACK}`)
      if (gotRolledBack.status === 'CANCELLED') return ALEA_ERROR_TYPES.BET_DENIED

      const alreadyPresentTrasaction = await this.context.sequelize.models.casinoTransaction.findOne({ where: { transactionId: id }, attributes: ['status'], transaction })
      if (alreadyPresentTrasaction && alreadyPresentTrasaction.status === CASINO_TRANSACTION_STATUS.FAILED) return ALEA_ERROR_TYPES.BET_DENIED

      if (alreadyPresentTrasaction) {
        const userWallet = await this.context.sequelize.models.wallet.findAll({
          where: { userId },
          attributes: ['amount'],
          include: {
            model: this.context.sequelize.models.currency,
            where: { type: coin === SWEEPS_COINS.GC ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN },
            required: true,
            attributes: []
          },
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

      const result = await CreateCasinoTransactionService.execute({
        userId,
        amount,
        gameId,
        currencyType: coin === SWEEPS_COINS.GC ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN,
        transactionId: id,
        roundId: round.id,
        purpose: LEDGER_PURPOSE.CASINO_BET,
        metaData: this.args
      }, this.context)

      if (!_.isEmpty(result.errors)) return this.mergeErrors(result.errors)

      if (currency === SWEEPS_COINS.SC) {
        const user = await this.context.sequelize.models.user.findOne({ where: { id: userId }, attributes: ['uniqueId', 'id', 'scWaggeredAmount'], transaction })
        await this.context.sequelize.models.user.update(
          { scWaggeredAmount: NumberPrecision.plus(user?.scWaggeredAmount || 0, +amount) },
          { where: { id: userId }, transaction }
        )
        user.scWaggeredAmount = NumberPrecision.plus(user?.scWaggeredAmount || 0, +amount)
        await UserLevelUpgradeService.execute({ userDetails: user }, this.context)
      }

      return {
        id: result.result.casinoTransaction.id,
        // transactionId: betTransaction?.transactionId, // Only for testing purposes
        realBalance: result.result.updatedBalance,
        bonusBalance: 0.0,
        realAmount: amount,
        bonusAmount: 0.0
      }
    } catch (error) {
      Logger.error(`Error in Alea Play Bet Service - ${error}`)
      const transactionStatuses = ['commit', 'rollback']
      if (!(~transactionStatuses.indexOf(transaction.finished))) { await transaction.rollback() }
      return ALEA_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
