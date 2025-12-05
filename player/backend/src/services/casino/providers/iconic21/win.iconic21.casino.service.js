import { iconic21CasinoConfig } from '@src/configs/casinoproviders/iconic21.config'
import { CURRENCY_TYPES, LEDGER_PURPOSE, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import { CreateCasinoTransactionService } from '../../common/createCasinoTransaction.service'
import _ from 'lodash'
import { Logger } from '@src/libs/logger'
import { ICONIC21_ERROR_TYPES } from '@src/utils/constants/casinoProviders/iconic21.constant'
import ServiceBase from '@src/libs/serviceBase'
import crypto from 'crypto'
import { Cache } from '@src/libs/cache'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { Op } from 'sequelize'

export class Iconic21WinService extends ServiceBase {
  async run () {
    const transaction = this.context.sequelizeTransaction
    const {
      amount,
      playerId,
      transactionId,
      launchAlias,
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
      let payload
      if (redisData && Object.keys(redisData).length) payload = JSON.parse(redisData)

      if (!payload) { // Most probably this condition won't occur ever
        const [game, user] = await Promise.all([
          await this.context.sequelize.models.casinoGame.findOne({
            where: { uniqueId: String(launchAlias) },
            transaction,
            raw: true
          }),
          await this.context.sequelize.models.user.findByPk(userId, { attributes: ['id', 'isActive'] }, transaction)
        ])

        if (!game) {
          await transaction.rollback()
          return ICONIC21_ERROR_TYPES.GAME_NOT_FOUND
        }

        if (!user) {
          await transaction.rollback()
          return ICONIC21_ERROR_TYPES.PLAYER_NOT_FOUND
        }
        // Create payload from these
        payload = { userId, coin, gameId: game?.id, game, user }
      }
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

      const checkTransactions = await this.context.sequelize.models.casinoTransaction.findAll({
        where: {
          [Op.or]: [
            { transactionId: `${transactionId}` },
            { roundId: `${roundId}` }
          ]
        },
        attributes: ['transactionId', 'roundId'],
        include: {
          as: 'casinoLedger',
          model: this.context.sequelize.models.ledger,
          where: {
            purpose: {
              [Op.in]: [LEDGER_PURPOSE.CASINO_WIN, LEDGER_PURPOSE.CASINO_BET]
            }
          },
          required: true,
          attributes: ['purpose']
        },
        transaction
      })

      if (!checkTransactions || checkTransactions.length === 0) {
        await transaction.rollback()
        return ICONIC21_ERROR_TYPES.INVALID_BEHAVIOUR
      }

      const isWinInSameRound = checkTransactions.some(
        tx => tx.roundId === roundId && tx.casinoLedger.some(ledger => ledger.purpose === LEDGER_PURPOSE.CASINO_WIN)
      )

      if (isWinInSameRound) {
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

        const balance = userWallet.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0)

        await transaction.rollback()
        return { balance }
      }

      const isDuplicateTransactionId = checkTransactions.some(tx => tx.transactionId === transactionId)
      if (isDuplicateTransactionId) {
        await transaction.rollback()
        return ICONIC21_ERROR_TYPES.INVALID_TRANSACTION_ID
      }

      const isValidBet = checkTransactions.some(
        tx => tx.roundId === roundId && tx.casinoLedger.some(ledger => ledger.purpose === LEDGER_PURPOSE.CASINO_BET)
      )
      if (!isValidBet) {
        await transaction.rollback()
        return ICONIC21_ERROR_TYPES.INVALID_BEHAVIOUR
      }

      const result = await CreateCasinoTransactionService.execute({
        userId,
        amount,
        gameId,
        currencyType: coin === SWEEPS_COINS.GC ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN,
        transactionId,
        roundId,
        purpose: LEDGER_PURPOSE.CASINO_WIN,
        metaData: this.args
      }, this.context)

      if (!_.isEmpty(result.errors)) {
        await transaction.rollback()
        return this.mergeErrors(result.errors)
      }
      return { balance: result?.result?.updatedBalance }
    } catch (error) {
      Logger.error(`Error in Iconic 21 Play Win Service - ${error}`)
      const transactionStatuses = ['commit', 'rollback']
      if (!(~transactionStatuses.indexOf(transaction.finished))) { await transaction.rollback() }
      return ICONIC21_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
