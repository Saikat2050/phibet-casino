import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'
import { CURRENCY_TYPES, LEDGER_PURPOSE, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'
import { CreateCasinoTransactionService } from '../../common/createCasinoTransaction.service'
import { verifySignature } from './alea.helper'
import { NumberPrecision } from '@src/libs/numberPrecision'
import _ from 'lodash'
import { Logger } from '@src/libs/logger'

export class BetAndWinAleaCasinoService extends ServiceBase {
  async run () {
    const { id, casinoSessionId, bet, win, round, player, currency, game } = this.args
    const transaction = this.context.sequelizeTransaction

    const betAmount = bet.amount
    const winAmount = win.amount

    try {
      if (+betAmount < 0) return ALEA_ERROR_TYPES.BET_DENIED
      if (!verifySignature(this.args)) return ALEA_ERROR_TYPES.INVALID_SIGNATURE

      const payload = await Cache.get(`alea_${casinoSessionId}`)
      if (!payload || (payload && !Object.keys(payload).length)) {
        Logger.info(`Values for load testing - ${casinoSessionId}, payload - ${JSON.stringify(payload)}`)
        return ALEA_ERROR_TYPES.SESSION_EXPIRED
      }

      const { userId, coin, gameId, uniqueGameId } = JSON.parse(payload)
      if (!userId) return ALEA_ERROR_TYPES.SESSION_EXPIRED

      if (String(game.id) !== String(uniqueGameId)) {
        await transaction.rollback()
        return ALEA_ERROR_TYPES.GAME_NOT_FOUND
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

      // const isScActive = coin === 'SC'

      // await resetSocketLoginToken({ key: `user:${userData.uniqueId}` })

      // Not needed by this client
      // if (coin === 'SC') {
      //   const limitCheck = await checkBetLimit({
      //     userId,
      //     betAmount: parseFloat(betAmount)
      //   })
      //   if (limitCheck.limitReached) {
      //     await transaction.rollback()
      //     return BET_MAX
      //   }
      // }

      const checkTransaction = await this.context.sequelize.models.casinoTransaction.findOne({
        attributes: ['transactionId', 'roundId'],
        where: {
          [Op.or]: [
            { transactionId: `${id}` + '' },
            { roundId: round.id + '' }
          ]
        },
        transaction
      })

      if (checkTransaction?.transactionId === `${id}:win` + '' || checkTransaction?.transactionId === `${id}:bet` + '') {
        const userWallet = await this.context.sequelize.models.wallet.findAll({
          where: { userId },
          attributes: ['amount'],
          include: {
            model: this.context.sequelize.models.currency,
            where: { type: coin === SWEEPS_COINS.GC ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN },
            required: true,
            attributes: []
          },
          lock: { level: transaction.LOCK.UPDATE, of: this.context.sequelize.models.wallet },
          transaction
        })
        const updatedBalance = userWallet.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0)

        return {
          realBalance: updatedBalance,
          bonusBalance: 0.00,
          bet: {
            realAmount: betAmount,
            bonusAmount: 0.00
          },
          win: {
            realAmount: winAmount,
            bonusAmount: 0.00
          },
          isAlreadyProcessed: true
        }
      }

      // if (checkTransaction?.roundId === round.id + '') return ALEA_ERROR_TYPES.BET_DENIED

      const wallet = await this.context.sequelize.models.wallet.findAll({
        where: { userId },
        include: {
          model: this.context.sequelize.models.currency,
          attributes: ['code', 'type'],
          where: { type: (coin === SWEEPS_COINS.GC) ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN },
          required: true
        },
        lock: { level: transaction.LOCK.UPDATE, of: this.context.sequelize.models.wallet },
        transaction
      })

      const betResult = await CreateCasinoTransactionService.execute({
        userId,
        amount: betAmount,
        gameId,
        wallet,
        currencyType: coin === SWEEPS_COINS.GC ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN,
        transactionId: `${id}:bet`,
        roundId: round.id,
        purpose: LEDGER_PURPOSE.CASINO_BET,
        metaData: this.args
      }, this.context)

      if (!_.isEmpty(betResult.errors)) return this.mergeErrors(betResult.errors)

      const winResult = await CreateCasinoTransactionService.execute({
        userId,
        amount: winAmount,
        gameId,
        wallet,
        currencyType: coin === SWEEPS_COINS.GC ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN,
        transactionId: `${id}:win`,
        roundId: round.id,
        purpose: LEDGER_PURPOSE.CASINO_WIN,
        metaData: this.args
      }, this.context)

      if (!_.isEmpty(winResult.errors)) return this.mergeErrors(winResult.errors)
      return {
        realBalance: winResult.result.updatedBalance,
        bonusBalance: 0.0,
        bet: {
          realAmount: betAmount,
          bonusAmount: 0.0
        },
        win: {
          realAmount: winAmount,
          bonusAmount: 0.0
        }
      }
    } catch (error) {
      Logger.error(`Error in Bet and Win Alea Play - ${error}`)
      const transactionStatuses = ['commit', 'rollback']
      if (!(~transactionStatuses.indexOf(transaction.finished))) { await transaction.rollback() }
      return ALEA_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
