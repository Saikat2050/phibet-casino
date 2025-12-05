
import { iconic21CasinoConfig } from '@src/configs/casinoproviders/iconic21.config'
import { CURRENCY_TYPES, LEDGER_PURPOSE, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { CreateCasinoTransactionService } from '../../common/createCasinoTransaction.service'
import _ from 'lodash'
import { UserLevelUpgradeService } from '../../common/userLevelUpgrade.service'
import { Logger } from '@src/libs/logger'
import { ICONIC21_ERROR_TYPES } from '@src/utils/constants/casinoProviders/iconic21.constant'
import ServiceBase from '@src/libs/serviceBase'
import crypto from 'crypto'
import { Cache } from '@src/libs/cache'
import { Op } from 'sequelize'

export class Iconic21BetService extends ServiceBase {
  async run () {
    const transaction = this.context.sequelizeTransaction
    const {
      amount,
      playerId,
      transactionId,
      sessionToken: sessionId,
      playerGameRoundCode: roundId,
      rawBody,
      signature
    } = this.args

    try {
      if (+amount < 0) {
        await transaction.rollback()
        return ICONIC21_ERROR_TYPES.BAD_REQUEST
      }

      const { secretKey } = iconic21CasinoConfig
      const sign = crypto.createHash('sha256').update(`${secretKey}${rawBody}`).digest('hex')
      const verifySignature = signature === sign
      if (!verifySignature) {
        await transaction.rollback()
        return ICONIC21_ERROR_TYPES.INVALID_SIGNATURE
      }

      const [userId, coin] = playerId.split('_')
      const redisData = await Cache.get(`gamePlay-${userId}`)
      if (!redisData || (redisData && !Object.keys(redisData).length)) {
        await transaction.rollback()
        return ICONIC21_ERROR_TYPES.SESSION_EXPIRED
      }

      const payload = JSON.parse(redisData)
      if (!payload?.userId || !payload?.coin || !payload?.gameId) {
        await transaction.rollback()
        return ICONIC21_ERROR_TYPES.SESSION_EXPIRED
      }

      if (+payload.userId !== +userId || payload.coin !== coin) {
        await transaction.rollback()
        return ICONIC21_ERROR_TYPES.PLAYER_NOT_FOUND
      }
      const { game, user, gameId } = payload
      if (!game) {
        await transaction.rollback()
        return ICONIC21_ERROR_TYPES.GAME_NOT_FOUND
      }
      if (!user) {
        await transaction.rollback()
        return ICONIC21_ERROR_TYPES.PLAYER_NOT_FOUND
      }

      const [checkTransactions, userWallet] = await Promise.all([
        this.context.sequelize.models.casinoTransaction.findAll({
          attributes: ['transactionId', 'roundId'],
          where: {
            [Op.or]: [
              { transactionId: `${transactionId}` },
              { roundId: `${roundId}` }
            ]
          },
          include: {
            model: this.context.sequelize.models.ledger,
            as: 'casinoLedger',
            required: true,
            attributes: ['purpose'],
            where: {
              purpose: {
                [Op.in]: [LEDGER_PURPOSE.CASINO_BET, LEDGER_PURPOSE.CASINO_WIN]
              }
            }
          },
          transaction
        }),
        this.context.sequelize.models.wallet.findAll({
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
      ])

      const balance = userWallet.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0)
      if (+balance < +amount) {
        await transaction.rollback()
        return ICONIC21_ERROR_TYPES.INSUFFICIENT_FUNDS
      }

      if (checkTransactions.length > 0) {
        const hasSameTransactionId = checkTransactions.some(tx => tx.transactionId === transactionId)
        if (hasSameTransactionId) {
          await transaction.rollback()
          return ICONIC21_ERROR_TYPES.TRANSACTION_ALREADY_PROCESSED
        }

        const winInSameRound = checkTransactions.some(tx =>
          tx.roundId === roundId &&
          tx.casinoLedger.some(ledger => ledger.purpose === LEDGER_PURPOSE.CASINO_WIN)
        )

        if (winInSameRound) {
          await transaction.rollback()
          return ICONIC21_ERROR_TYPES.INVALID_BEHAVIOUR
        }
      }
      const result = await CreateCasinoTransactionService.execute({
        userId,
        amount,
        gameId,
        currencyType: coin === SWEEPS_COINS.GC ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN,
        transactionId,
        roundId,
        purpose: LEDGER_PURPOSE.CASINO_BET,
        metaData: this.args
      }, this.context)

      if (!_.isEmpty(result.errors)) {
        await transaction.rollback()
        return this.mergeErrors(result.errors)
      }

      if (coin === SWEEPS_COINS.SC) {
        const user = await this.context.sequelize.models.user.findByPk(userId, { attributes: ['uniqueId', 'id', 'scWaggeredAmount'], transaction })
        await this.context.sequelize.models.user.update(
          { scWaggeredAmount: NumberPrecision.plus(user?.scWaggeredAmount || 0, +amount) },
          { where: { id: userId }, transaction }
        )
        user.scWaggeredAmount = NumberPrecision.plus(user?.scWaggeredAmount || 0, +amount)
        await UserLevelUpgradeService.execute({ userDetails: user }, this.context)
      }

      return { balance: result?.result?.updatedBalance }
    } catch (error) {
      Logger.error(`Error in Iconic 21 Play Bet Service - ${error}`)
      const transactionStatuses = ['commit', 'rollback']
      if (!(~transactionStatuses.indexOf(transaction.finished))) { await transaction.rollback() }
      return ICONIC21_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
