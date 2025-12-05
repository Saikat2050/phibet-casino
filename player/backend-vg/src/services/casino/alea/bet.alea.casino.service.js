import { Op } from 'sequelize'
import * as jwt from 'jsonwebtoken'
import { minus, round } from 'number-precision'
import ServiceBase from '../../serviceBase'
import { sequelize } from '../../../db/models'
import config from '../../../configs/app.config'
import socketServer from '../../../libs/socketServer'
import { getGamePlayRedisToken } from '../../../utils/common'
import { ACTION, ACTION_TYPE, AMOUNT_TYPE, CACHE_KEYS, TRANSACTION_STATUS } from '../../../utils/constants/constant'
import { INTERNAL_ERROR, INVALID_CURRENCY, INVALID_SIGNATURE, PLAYER_BLOCKED, PLAYER_NOT_FOUND, TRANSACTION_ALREADY_PROCESSED, scSum, verifySignature } from './alea.helper'
import InsufficientBalanceEmitter from '../../../socket-resources/emitter/insufficientBalance.emitter'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'

export class BetAleaCasinoService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Wallet: WalletModel,
        CasinoTransaction: CasinoTransactionModel,
        MasterCasinoGame: MasterCasinoGameModel
      }
    } = this.context

    const {
      amount,
      currency,
      id: transactionId,
      player: { casinoPlayerId: playerId },
      game: { id: identifier },
      casinoSessionId: sessionId,
      round: { id: roundId, status: roundStatus }
    } = this.args

    let beforeBalance = 0
    let afterBalance = 0

    const socketObj = {}
    const moreDetails = {
      bsc: 0,
      psc: 0,
      wsc: 0,
      providerTransactionId: this?.args?.integratorTransactionId,
      providerPlayerId: this?.args?.player?.id,
      requestJSONString: this.args.stringData
    }

    const transaction = await sequelize.transaction()
    try {
      if (+amount < 0) {
        await transaction.commit()
        return TRANSACTION_ALREADY_PROCESSED
      }

      const gotRollbackBefore = await getGamePlayRedisToken({ key: transactionId })

      if (gotRollbackBefore && gotRollbackBefore === 'CANCELLED') {
        return {
          statusCode: 403,
          status: 'DENIED',
          code: 'BET_DENIED',
          message: 'Already Got Rollback'
        }
      }

      if (!verifySignature(this.args)) {
        await transaction.commit()

        return INVALID_SIGNATURE
      }

      const jwtToken = await socketServer.redisClient.get(`gamePlay-${sessionId.split('_')[0]}`)

      if (!jwtToken) {
        await transaction.commit()

        return {
          statusCode: 403,
          status: 'DENIED',
          code: 'SESSION_EXPIRED',
          message: 'Game Session Expired'
        }
      }

      const payload = jwt.verify(jwtToken, config.get('jwt.casinoGamePlaySecret'))

      if (!payload?.userId || !payload?.coin || !payload?.gameId) {
        await transaction.commit()

        return {
          statusCode: 403,
          status: 'DENIED',
          code: 'SESSION_EXPIRED',
          message: 'Game Session Expired'
        }
      }
      const gamesCache = await socketServer.redisClient.get(CACHE_KEYS.GAMES)
      const parsedGames = JSON.parse(gamesCache || '[]')
      let isGameExist
      if (parsedGames.length) {
        isGameExist = parsedGames.find(game => game.identifier === identifier + '')
        if (!isGameExist) {
          await transaction.commit()

          return {
            statusCode: 403,
            status: 'DENIED',
            code: 'GAME_NOT_ALLOWED',
            message: 'This bet game could not be found in the casino.'
          }
        }
      } else {
        isGameExist = await MasterCasinoGameModel.findOne({
          attributes: ['identifier', 'masterCasinoProviderId', 'masterCasinoGameId'],
          where: {
            identifier: identifier + ''
          },
          transaction
        })

        if (!isGameExist) {
          await transaction.commit()

          return {
            statusCode: 403,
            status: 'DENIED',
            code: 'GAME_NOT_ALLOWED',
            message: 'This bet game could not be found in the casino.'
          }
        }
      }

      // if (+payload.identifier !== +identifier) {
      //   await transaction.commit()

      //   return {
      //     statusCode: 403,
      //     status: 'DENIED',
      //     code: 'GAME_NOT_ALLOWED',
      //     message: 'This bet game could not be found in the casino.'
      //   }
      // }

      const [userId, coin] = playerId.split('_')

      if (+payload.userId !== +userId || payload.coin !== coin) {
        await transaction.commit()

        return PLAYER_NOT_FOUND
      }

      if (currency !== payload.coin) {
        await transaction.commit()

        return INVALID_CURRENCY
      }

      const { userData } = payload

      // if (!isGameExist) {
      //   await transaction.commit()

      //   return {
      //     statusCode: 403,
      //     status: 'DENIED',
      //     code: 'GAME_NOT_ALLOWED',
      //     message: 'This bet game could not be found in the casino.'
      //   }
      // }
      if (!userData) {
        await transaction.commit()

        return PLAYER_NOT_FOUND
      }

      if (userData.isBan) {
        await transaction.commit()

        return PLAYER_BLOCKED
      }

      const isScActive = coin === 'SC'

      const userWallet = await WalletModel.findOne({
        attributes: ['walletId', 'scCoin', 'gcCoin', 'currencyCode'],
        where: { ownerId: userData.userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      const balance = isScActive ? +scSum(userWallet) : +userWallet.gcCoin

      const checkTransaction = await CasinoTransactionModel.findOne({
        attributes: ['amount'],
        where: {
          [Op.or]: [
            { transactionId: `${transactionId}` + '' },
            { roundId: roundId + '', roundStatus: true }
          ]
        },
        transaction
      })

      // if (checkTransaction?.transactionId === transactionId + '') {
      //   await transaction.commit()
      //   return TRANSACTION_ALREADY_PROCESSED
      // }
      if (checkTransaction) {
        await transaction.commit()

        return {
          statusCode: 200,
          realBalance: balance,
          bonusBalance: 0,
          realAmount: checkTransaction?.amount,
          bonusAmount: 0.0,
          isAlreadyProcessed: true
        }
      }

      if (isScActive ? +scSum(userWallet) < +amount : +userWallet.gcCoin < +amount) {
        socketObj.insufficientBalance = true
        socketObj.coinType = isScActive ? 'scCoin' : 'gcCoin'
        InsufficientBalanceEmitter.insufficientBalance(socketObj, userId)
        await transaction.commit()

        return {
          statusCode: 403,
          status: 'DENIED',
          code: 'INSUFFICIENT_FUNDS',
          message: "Player doesn't have sufficient balance to place a bet."
        }
      }

      if (isScActive) {
        let remainingBetAmount = 0
        const totalScCoin = +scSum(userWallet)
        if (+userWallet.scCoin.bsc >= +amount) {
          userWallet.scCoin = { ...userWallet.scCoin, bsc: +round(+minus(+userWallet.scCoin.bsc, +amount), 2) }
          moreDetails.bsc = +amount // Entering the amount we cut from bsc
        } else {
          remainingBetAmount = +round(+minus(+amount, +userWallet.scCoin.bsc), 2)
          moreDetails.bsc = +userWallet.scCoin.bsc
          userWallet.scCoin = { ...userWallet.scCoin, bsc: 0 }
          if (+userWallet.scCoin.psc >= +remainingBetAmount) {
            userWallet.scCoin = { ...userWallet.scCoin, psc: +round(+minus(+userWallet.scCoin.psc, +remainingBetAmount), 2) }
            moreDetails.psc = +remainingBetAmount
          } else {
            remainingBetAmount = +round(+minus(+remainingBetAmount, +userWallet.scCoin.psc), 2)
            moreDetails.psc = +userWallet.scCoin.psc
            userWallet.scCoin = { ...userWallet.scCoin, psc: 0 }
            if (+remainingBetAmount > +userWallet.scCoin.wsc) {
              socketObj.insufficientBalance = true
              socketObj.coinType = isScActive ? 'scCoin' : 'gcCoin'
              InsufficientBalanceEmitter.insufficientBalance(socketObj, userId)

              await transaction.commit()
              return {
                statusCode: 403,
                status: 'DENIED',
                code: 'INSUFFICIENT_FUNDS',
                message: "Player doesn't have sufficient balance to place a bet."
              }
            }
            userWallet.scCoin = { ...userWallet.scCoin, wsc: +round(+minus(+userWallet.scCoin.wsc, +remainingBetAmount), 2) }
            moreDetails.wsc = +remainingBetAmount
          }
        }

        beforeBalance = +round(+totalScCoin, 2)
        afterBalance = +round(+minus(totalScCoin, +amount), 2)
        socketObj.scCoin = +afterBalance
      } else {
        beforeBalance = +round(+userWallet.gcCoin, 2)
        afterBalance = +round(+minus(+userWallet.gcCoin, +amount), 2)
        userWallet.gcCoin = +afterBalance
        socketObj.gcCoin = +afterBalance
      }

      await userWallet.save({ transaction })

      const transactionObj = {
        transactionId: transactionId + '',
        userId,
        actionType: ACTION.BET,
        actionId: ACTION_TYPE.DEBIT,
        amount: amount,
        gc: isScActive ? 0 : +amount,
        sc: isScActive ? +amount : 0,
        gameId: +isGameExist.masterCasinoGameId,
        roundId: roundId + '',
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        beforeBalance: beforeBalance,
        afterBalance: afterBalance,
        amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        device: 'desktop',
        createdAt: new Date(),
        updatedAt: new Date(),
        gameIdentifier: identifier,
        roundStatus: roundStatus === 'COMPLETED',
        status: TRANSACTION_STATUS.SUCCESS,
        moreDetails,
        sessionId
      }

      const betTransaction = await CasinoTransactionModel.create(transactionObj, { transaction })

      WalletEmitter.emitUserWalletBalance(socketObj, userId)

      await transaction.commit()
      return {
        id: betTransaction?.casinoTransactionId,
        // transactionId: betTransaction?.transactionId, // Only for testing purposes
        realBalance: afterBalance,
        bonusBalance: 0.0,
        realAmount: amount,
        bonusAmount: 0.0
      }
    } catch (error) {
      console.log('Error in Alea Play Bet Service', error)
      const transactionStatuses = ['commit', 'rollback']
      if (!(~transactionStatuses.indexOf(transaction.finished))) { await transaction.rollback() }
      return INTERNAL_ERROR
    }
  }
}
