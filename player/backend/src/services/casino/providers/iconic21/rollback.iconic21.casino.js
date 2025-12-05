import { iconic21CasinoConfig } from '@src/configs/casinoproviders/iconic21.config'
import { CURRENCY_TYPES, LEDGER_PURPOSE, LEDGER_TRANSACTION_TYPE, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import { Logger } from '@src/libs/logger'
import { ICONIC21_ERROR_TYPES } from '@src/utils/constants/casinoProviders/iconic21.constant'
import { CASINO_TRANSACTION_STATUS } from '@src/utils/constants/casinoManagement.constants'
import { NumberPrecision } from '@src/libs/numberPrecision'
import ServiceBase from '@src/libs/serviceBase'
import crypto from 'crypto'
import { Cache } from '@src/libs/cache'
import { CreateLedgerService } from '@src/services/ledger/createLedger.service'

export class Iconic21RollBackService extends ServiceBase {
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

      // Check if the transaction has already been processed
      const checkTransaction = await this.context.sequelize.models.casinoTransaction.findOne({
        attributes: ['id', 'transactionId', 'status', 'roundId', 'gameId'],
        where: { transactionId: `${transactionId}:rollback` },
        transaction
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
          transaction
        })
        const updatedBalance = userWallet.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0)

        return { balance: updatedBalance }
      }

      // Fetch existing rollback transactions
      const checkRollbackTransaction = await this.context.sequelize.models.casinoTransaction.findOne({
        attributes: ['id', 'transactionId', 'status', 'roundId', 'gameId'],
        where: { userId, roundId: roundId + '', transactionId: transactionId + '' },
        include: {
          as: 'casinoLedger',
          model: this.context.sequelize.models.ledger,
          required: true
        },
        transaction
      })

      if (!checkRollbackTransaction) {
        await transaction.rollback()
        return ICONIC21_ERROR_TYPES.INVALID_TRANSACTION_ID
      }

      const [casinoTransaction] = await this.context.sequelize.models.casinoTransaction.findOrCreate({
        where: {
          userId,
          gameId,
          transactionId: `${transactionId}:rollback`,
          roundId
        },
        defaults: {
          userId,
          gameId,
          transactionId: `${transactionId}:rollback`,
          metaData: this.args,
          status: CASINO_TRANSACTION_STATUS.COMPLETED,
          roundId
        },
        transaction
      })
      await CreateLedgerService.execute({
        amount,
        transactionType: LEDGER_TRANSACTION_TYPE.CASINO,
        walletId: checkRollbackTransaction?.casinoLedger[0].purpose === LEDGER_PURPOSE.CASINO_BET ? checkRollbackTransaction?.casinoLedger[0]?.fromWalletId : checkRollbackTransaction?.casinoLedger[0]?.toWalletId,
        userId,
        purpose: checkRollbackTransaction?.casinoLedger[0]?.purpose === LEDGER_PURPOSE.CASINO_BET
          ? LEDGER_PURPOSE.CASINO_BET_ROLLBACK
          : LEDGER_PURPOSE.CASINO_WIN_ROLLBACK,
        transactionId: casinoTransaction.id,
        currencyId: checkRollbackTransaction?.casinoLedger[0].currencyId
      }, this.context)

      // Fetch and calculate the updated balance
      const updatedWallets = await this.context.sequelize.models.wallet.findAll({
        where: { userId },
        attributes: ['amount'],
        include: { model: this.context.sequelize.models.currency, where: { type: coin === SWEEPS_COINS.GC ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN }, attributes: [], required: true },
        transaction
      })

      const updatedBalance = updatedWallets.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0)
      return { balance: updatedBalance }
    } catch (error) {
      Logger.error(`Error in Iconic 21 Play Rollback Service - ${error}`)
      const transactionStatuses = ['commit', 'rollback']
      if (!(~transactionStatuses.indexOf(transaction.finished))) { await transaction.rollback() }
      return ICONIC21_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
