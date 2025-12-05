import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import Logger from '../../../libs/logger'
import ServiceBase from '../../serviceBase'
import { sequelize } from '../../../db/models'
import config from '../../../configs/app.config'
import { round, plus, minus } from 'number-precision'
import socketServer from '../../../libs/socketServer'
import InsufficientBalanceEmitter from '../../../socket-resources/emitter/insufficientBalance.emitter'
import { ACTION, ACTION_TYPE, AMOUNT_TYPE, CASINO_TRANSACTION_STATUS } from '../../../utils/constants/constant'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import { resetSocketLoginToken } from '../../../utils/common'
export class BetWinBoomingCasinoService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Wallet: WalletModel,
        CasinoTransaction: CasinoTransactionModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const {
      round: roundId,
      transaction_id: transactionId,
      player_id: playerId,
      debit: betAmount,
      credit: winAmount,
      game_cycle: gameCycle,
      session_id: sessionId,
      operator_launch_data: launchGameData
    } = this.args
    let betBeforeBalance = 0
    let betAfterBalance = 0
    let winBeforeBalance = 0
    let winAfterBalance = 0
    const moreDetails = { bsc: 0, psc: 0, wsc: 0, bscWin: 0 }
    let isScActive = false

    // const sequelizeTransaction = await sequelize.transaction()
    // const { gcSpinLimit: lowGcLimit } = await settingData(sequelizeTransaction)

    const socketObj = {}
    try {
      if (!playerId || !launchGameData || +betAmount < 0 || +winAmount < 0) {
        throw new Error('BET_DENIED')
      }
      const extractPlayerData = JSON.parse(launchGameData)
      let playerData = extractPlayerData?.id
      playerData = playerData.split('_')
      const userId = playerData[0]
      const coin = playerData[1]
      const uniqueId = playerData[2]
      isScActive = coin === 'SC'
      const jwtToken = await socketServer.redisClient.get(`gamePlay-${uniqueId}`)
      if (!jwtToken) {
        throw new Error('BET_DENIED')
      }
      const payload = jwt.verify(jwtToken, config.get('jwt.casinoGamePlaySecret'))
      const { isGameExist, userData } = payload

      if (!userData) {
        throw new Error('PLAYER_NOT_FOUND')
      }
      if (userData.isBan) {
        throw new Error('PLAYER_BLOCKED')
      }

      // if (coin === 'SC' && payload.playLimits.length > 0) {
      //   const limitCheck = await checkBetLimit({ userId, betAmount: +betAmount })
      //   if (limitCheck.limitReached) {
      //     await sequelizeTransaction.commit()
      //     throw new Error('BET_DENIED')
      //   }
      // }

      const [checkTransaction, userWallet] = await Promise.all([
        CasinoTransactionModel.findOne({
          attributes: ['transactionId', 'moreDetails', 'amount' ],
          where: {
            transactionId: `${transactionId}`
          },
          transaction
        }),
        WalletModel.findOne({
          attributes: ['walletId', 'amount', 'currencyCode', 'ownerId', 'totalScCoin', 'gcCoin', 'scCoin'],
          where: { ownerId: userId },
          lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
          transaction
        })
      ])
      if (!userWallet) {
        throw new Error('WALLET_NOT_FOUND')
      }

      const accountBalance = isScActive
        ? +round(+userWallet.totalScCoin, 2)
        : +round(+userWallet.gcCoin, 2)

      if (+accountBalance < +betAmount) {
        socketObj.insufficientBalance = true
        socketObj.coinType = isScActive ? 'scCoin' : 'gcCoin'
        InsufficientBalanceEmitter.insufficientBalance(socketObj, userId)
        return {

          error: 'low_balance',
          message:
            'You have insufficient balance to place a bet.',
          buttons: [
            {
              title: 'OK',
              action: 'close_dialog'
            },
            {
              title: 'Deposit Funds',
              action: 'top_up'
            },
            {
              title: 'Exit game',
              action: 'exit'
            }
          ]
        }
      }
      // bet calculation
      if (isScActive) {
        let remainingBetAmount = 0
        const totalScCoin = +userWallet.totalScCoin

        if (+userWallet.scCoin.bsc >= betAmount) {
          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +round(+minus(+userWallet.scCoin.bsc, +betAmount), 2)
          }
          moreDetails.bsc = +betAmount
        } else {
          remainingBetAmount = +round(
            +minus(+betAmount, +userWallet.scCoin.bsc),
            2
          )
          moreDetails.bsc = +userWallet.scCoin.bsc
          userWallet.scCoin = { ...userWallet.scCoin, bsc: 0 }

          if (+userWallet.scCoin.psc >= remainingBetAmount) {
            userWallet.scCoin = {
              ...userWallet.scCoin,
              psc: +round(+minus(+userWallet.scCoin.psc, remainingBetAmount), 2)
            }
            moreDetails.psc = +remainingBetAmount
          } else {
            remainingBetAmount = +round(
              +minus(remainingBetAmount, +userWallet.scCoin.psc),
              2
            )
            moreDetails.psc = +userWallet.scCoin.psc
            userWallet.scCoin = { ...userWallet.scCoin, psc: 0 }

            if (remainingBetAmount > +userWallet.scCoin.wsc) {
              socketObj.insufficientBalance = true
              socketObj.coinType = isScActive ? 'scCoin' : 'gcCoin'
              InsufficientBalanceEmitter.insufficientBalance(socketObj, userId)
              return {

                error: 'low_balance',
                message:
                  'You have insufficient balance to place a bet.',
                buttons: [
                  {
                    title: 'OK',
                    action: 'close_dialog'
                  },
                  {
                    title: 'Deposit Funds',
                    action: 'top_up'
                  },
                  {
                    title: 'Exit game',
                    action: 'exit'
                  }
                ]
              }
            }

            userWallet.scCoin = {
              ...userWallet.scCoin,
              wsc: +round(+minus(+userWallet.scCoin.wsc, remainingBetAmount), 2)
            }
            moreDetails.wsc = +remainingBetAmount
          }
        }

        betBeforeBalance = +round(+totalScCoin, 2)
        betAfterBalance = +round(+minus(totalScCoin, betAmount), 2)
      } else {
        // GC coin logic
        betBeforeBalance = +userWallet.gcCoin
        betAfterBalance = +round(+minus(+userWallet.gcCoin, +betAmount), 2)
        userWallet.gcCoin = +betAfterBalance
      }

      // const tournamentId = checkTournament(payload?.tournament, userId)
      const betTransaction = {
        transactionId: transactionId,
        userId: +userId,
        amount: betAmount,
        gc: isScActive ? 0 : +betAmount,
        sc: isScActive ? +betAmount : 0,
        gameId: +isGameExist.masterCasinoGameId,
        actionType: ACTION.BET,
        actionId: ACTION_TYPE.DEBIT,
        roundId: `${roundId}_${uuid()}`,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        status: CASINO_TRANSACTION_STATUS.COMPLETED,
        roundStatus: gameCycle.ends,
        beforeBalance: betBeforeBalance,
        afterBalance: betAfterBalance,
        amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        createdAt: new Date(),
        updatedAt: new Date(),
        moreDetails: { ...moreDetails, isBetWinBet: true },
        gameIdentifier: isGameExist?.identifier,
        sessionId,
        // tournamentId
      }

      const winTransaction = {
        ...betTransaction,
        actionType: ACTION.WIN,
        actionId: ACTION_TYPE.CREDIT,
        amount: winAmount,
        gc: isScActive ? 0 : +winAmount,
        sc: isScActive ? +winAmount : 0
      }

      const lostTransaction = {
        ...betTransaction,
        actionType: ACTION.LOST,
        actionId: ACTION_TYPE.DEBIT,
        amount: 0,
        gc: isScActive ? 0 : +winAmount,
        sc: isScActive ? +winAmount : 0
      }

      // win calculation
      if (isScActive) {
        winBeforeBalance = +round(+userWallet.totalScCoin, 2)
        winAfterBalance = +round(+plus(+winBeforeBalance, +winAmount), 2)

        userWallet.scCoin = {
          ...userWallet.scCoin,
          wsc: +round(+plus(+userWallet.scCoin.wsc, +winAmount), 2)
        }
        socketObj.scCoin = +winAfterBalance
        socketObj.wsc = +(+userWallet.scCoin.wsc)
        socketObj.winDetails = {
          amount: +round(+winAmount, 2),
          gameId: isGameExist.masterCasinoGameId,
          gameName: isGameExist.gameName,
          currency: 'USD'
        }
        moreDetails.bscWin = (+moreDetails?.bsc * +winAmount) / +betAmount
      } else {
        winBeforeBalance = +round(+userWallet.gcCoin, 2)
        winAfterBalance = +round(+plus(+winBeforeBalance, +winAmount), 2)
        userWallet.gcCoin = +winAfterBalance
        socketObj.gcCoin = +winAfterBalance
      }

      // if (+socketObj.gcCoin < +lowGcLimit) {
      //   lowGcBonusApplicable = true
      // }
      const transactions = []

      if (checkTransaction && betAmount === 0) {
        if (winAmount > 0) {
          transactions.push({
            ...winTransaction,
            moreDetails: { ...moreDetails },
            beforeBalance: +winBeforeBalance,
            afterBalance: +winAfterBalance
          })

          WalletEmitter.emitUserWalletBalance(socketObj, userId)
        } else {
          transactions.push({
            ...betTransaction,
            beforeBalance: +betBeforeBalance,
            afterBalance: +betAfterBalance
          })
        }
      } else {
        transactions.push({
          ...betTransaction,
          beforeBalance: +betBeforeBalance,
          afterBalance: +betAfterBalance
        })

        if (winAmount > 0) {
          transactions.push({
            ...winTransaction,
            moreDetails: { ...moreDetails },
            beforeBalance: +winBeforeBalance,
            afterBalance: +winAfterBalance
          })
        } else {
          transactions.push({
            ...lostTransaction,
            beforeBalance: +winBeforeBalance,
            afterBalance: +winAfterBalance
          })
        }
      }
      await Promise.all([
        CasinoTransactionModel.bulkCreate(transactions, { transaction }),
        userWallet.save({ transaction }),
        resetSocketLoginToken({ key: `user:${uniqueId}` })
      ])
      await transaction.commit()

      WalletEmitter.emitUserWalletBalance(socketObj, userId)

      return {
        balance: isScActive ? +userWallet.totalScCoin : +userWallet.gcCoin
      }
    } catch (error) {
      Logger.error('BetWinBoomingCasinoService', { message: error.message, exception: error, context: this.args, userCtx: this.context })
      await transaction.rollback()
      throw error.status ? error : new Error('INTERNAL_ERROR')
    }
  }
}
