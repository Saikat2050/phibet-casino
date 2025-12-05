import { Op } from 'sequelize'
import * as jwt from 'jsonwebtoken'
import ServiceBase from '../../serviceBase'
import { sequelize } from '../../../db/models'
import config from '../../../configs/app.config'
import socketServer from '../../../libs/socketServer'
import { plus, minus, round } from 'number-precision'
import { ACTION, ACTION_TYPE, AMOUNT_TYPE, CACHE_KEYS, CASINO_TRANSACTION_STATUS, TRANSACTION_STATUS } from '../../../utils/constants/constant'
import { BET_DENIED, INTERNAL_ERROR, INVALID_CURRENCY, INVALID_SIGNATURE, PLAYER_BLOCKED, PLAYER_NOT_FOUND, scSum, verifySignature } from './alea.helper'
import InsufficientBalanceEmitter from '../../../socket-resources/emitter/insufficientBalance.emitter'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'

export class BetAndWinAleaCasinoService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Wallet: WalletModel,
        CasinoTransaction: CasinoTransactionModel,
        MasterCasinoGame: MasterCasinoGameModel
      }
    } = this.context

    const {
      currency,
      id: transactionId,
      player: { casinoPlayerId: playerId },
      game: { id: identifier },
      casinoSessionId: sessionId,
      bet: { amount: betAmount },
      win: { amount: winAmount },
      round: { id: roundId, status: roundStatus }
    } = this.args

    let betBeforeBalance = 0
    let betAfterBalance = 0
    let winBeforeBalance = 0
    let winAfterBalance = 0

    const socketObj = {}
    const moreDetails = {
      bsc: 0,
      psc: 0,
      wsc: 0,
      bscWin: 0,
      providerTransactionId: this?.args?.integratorTransactionId,
      providerPlayerId: this?.args?.player?.id,
      requestJSONString: this.args.stringData
    }

    const transaction = await sequelize.transaction()

    try {
      if (+betAmount < 0) {
        await transaction.commit()
        return BET_DENIED
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
      console.log('parsed games =================', parsedGames)

      let isGameExist = parsedGames.find(game => game.identifier === identifier + '')
      console.log('isGameExist from cache =================', isGameExist)

      if (!isGameExist) {
        isGameExist = await MasterCasinoGameModel.findOne({
          attributes: ['identifier', 'masterCasinoProviderId', 'masterCasinoGameId'],
          where: {
            identifier: identifier + ''
          },
          transaction
        })
        console.log('isGameExist from DB =================', isGameExist)
      }
      if (!isGameExist) {
        await transaction.commit()

        return {
          statusCode: 403,
          status: 'DENIED',
          code: 'GAME_NOT_ALLOWED',
          message: 'This bet game could not be found in the casino.'
        }
      }

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

      // await resetSocketLoginToken({ key: `user:${userData.uniqueId}` })

      // Not needed by this client
      // if (coin === 'SC') {
      //   const limitCheck = await checkBetLimit({
      //     userId,
      //     betAmount: parseFloat(betAmount)
      //   })
      //   if (limitCheck.limitReached) {
      //     await transaction.commit()
      //     return BET_MAX
      //   }
      // }
      const userWallet = await WalletModel.findOne({
        attributes: ['walletId', 'scCoin', 'gcCoin', 'currencyCode'],
        where: { ownerId: userData.userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      const balance = isScActive ? +scSum(userWallet) : +userWallet.gcCoin

      const checkTransaction = await CasinoTransactionModel.findOne({
        attributes: ['transactionId', 'roundId', 'amount'],
        where: {
          [Op.or]: [
            { transactionId: `${transactionId}` + '' },
            { roundId: roundId + '', roundStatus: true }
          ]
        },
        transaction
      })

      if (checkTransaction?.transactionId === transactionId + '') {
        await transaction.commit()
        return {
          realBalance: balance,
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

      if (checkTransaction?.roundId === roundId + '') {
        await transaction.commit()
        return BET_DENIED
      }

      const accountBalance = isScActive ? +scSum(userWallet) : +round(+userWallet.gcCoin, 2)

      if (+accountBalance < +betAmount) {
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

      //  Bet Calculation
      if (isScActive) {
        let remainingBetAmount = 0
        const totalScCoin = +scSum(userWallet)
        if (+userWallet.scCoin.bsc >= betAmount) {
          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +minus(+userWallet.scCoin.bsc, betAmount).toFixed(2)
          }
          moreDetails.bsc = +betAmount // Entering the amount we cut from bsc
        } else {
          remainingBetAmount = +minus(
            betAmount,
            +userWallet.scCoin.bsc
          ).toFixed(2)
          moreDetails.bsc = +userWallet.scCoin.bsc
          userWallet.scCoin = { ...userWallet.scCoin, bsc: 0 }
          if (+userWallet.scCoin.psc >= +remainingBetAmount) {
            userWallet.scCoin = {
              ...userWallet.scCoin,
              psc: +minus(+userWallet.scCoin.psc, remainingBetAmount).toFixed(2)
            }
            moreDetails.psc = +remainingBetAmount
          } else {
            remainingBetAmount = +minus(
              remainingBetAmount,
              +userWallet.scCoin.psc
            ).toFixed(2)
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
            userWallet.scCoin = {
              ...userWallet.scCoin,
              wsc: +minus(+userWallet.scCoin.wsc, remainingBetAmount).toFixed(2)
            }
            moreDetails.wsc = +remainingBetAmount
          }
        }

        betBeforeBalance = +totalScCoin.toFixed(2)
        betAfterBalance = +minus(totalScCoin, betAmount).toFixed(2)
      } else if (!isScActive) {
        betBeforeBalance = +userWallet.gcCoin
        betAfterBalance = +minus(+userWallet.gcCoin, +betAmount).toFixed(2)
        userWallet.gcCoin = +betAfterBalance
      }

      //  Win Calculation
      const updatedBalance = isScActive
        ? +scSum(userWallet)
        : +userWallet.gcCoin

      if (isScActive) {
        winBeforeBalance = +updatedBalance
        winAfterBalance = +plus(+winBeforeBalance, +winAmount).toFixed(2)

        userWallet.scCoin = {
          ...userWallet.scCoin,
          wsc: +plus(+userWallet.scCoin.wsc, +winAmount).toFixed(2)
        }
        socketObj.scCoin = +winAfterBalance
        socketObj.wsc = +(+userWallet.scCoin.wsc)
        moreDetails.bscWin = (+moreDetails?.bsc * +winAmount) / +betAmount
      } else {
        winBeforeBalance = +updatedBalance
        winAfterBalance = +plus(+winBeforeBalance, +winAmount).toFixed(2)
        userWallet.gcCoin = +winAfterBalance
        socketObj.gcCoin = +winAfterBalance
      }

      await userWallet.save({ transaction })

      // Bet Transaction
      const betTransaction = {
        transactionId: transactionId + '',
        userId,
        actionType: ACTION.BET,
        actionId: ACTION_TYPE.DEBIT,
        amount: betAmount,
        gameId: +isGameExist.masterCasinoGameId,
        roundId: roundId + '',
        gc: isScActive ? 0 : +betAmount,
        sc: isScActive ? +betAmount : 0,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        beforeBalance: betBeforeBalance,
        afterBalance: betAfterBalance,
        amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        device: 'desktop',
        createdAt: new Date(),
        updatedAt: new Date(),
        gameIdentifier: identifier,
        status: TRANSACTION_STATUS.SUCCESS,
        roundStatus: roundStatus === 'COMPLETED',
        moreDetails: { ...moreDetails, isBetWinBet: true },
        sessionId
      }

      // Win Transaction
      const winTransaction = {
        transactionId: transactionId + '',
        userId: userData.userId,
        amount: +winAmount,
        gameId: +isGameExist.masterCasinoGameId,
        roundId: roundId,
        gc: isScActive ? 0 : +winAmount,
        sc: isScActive ? +winAmount : 0,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        beforeBalance: winBeforeBalance,
        afterBalance: winAfterBalance,
        amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        device: 'desktop',
        gameIdentifier: identifier,
        status: CASINO_TRANSACTION_STATUS.COMPLETED,
        roundStatus: roundStatus === 'COMPLETED',
        moreDetails,
        sessionId
      }

      if (+winAmount === 0) {
        winTransaction.actionType = ACTION.LOST
        winTransaction.actionId = ACTION_TYPE.LOST
      } else {
        winTransaction.actionType = ACTION.WIN
        winTransaction.actionId = ACTION_TYPE.CREDIT
      }

      await CasinoTransactionModel.bulkCreate(
        [betTransaction, winTransaction],
        { transaction }
      )

      WalletEmitter.emitUserWalletBalance(socketObj, userId)

      await transaction.commit()
      return {
        realBalance: winAfterBalance,
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
      console.log('Error in Bet and Win Alea Play', error)
      const transactionStatuses = ['commit', 'rollback']
      if (!(~transactionStatuses.indexOf(transaction.finished))) { await transaction.rollback() }
      return INTERNAL_ERROR
    }
  }
}
