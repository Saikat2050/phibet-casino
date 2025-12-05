import { Op } from 'sequelize'
import * as jwt from 'jsonwebtoken'
import ServiceBase from '../../serviceBase'
import { sequelize } from '../../../db/models'
import config from '../../../configs/app.config'
import socketServer from '../../../libs/socketServer'
import { round, plus, minus } from 'number-precision'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import { ACTION, ACTION_TYPE, AMOUNT_TYPE, CASINO_TRANSACTION_STATUS } from '../../../utils/constants/constant'
export class RollBackBoomingCasinoService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Wallet: WalletModel,
        CasinoTransaction: CasinoTransactionModel
      },
      sequelizeTransaction: transaction
    } = this.context
    const {
      transaction_id: transactionId,
      player_id: playerId,
      debit: betAmount,
      credit: winAmount,
      game_cycle: gameCycle,
      session_id: sessionId,
      operator_launch_data: launchGameData
    } = this.args
    let beforeBalance = 0
    let afterBalance = 0
    const socketObj = {}
    const moreDetails = {
      wsc: 0,
      psc: 0,
      bsc: 0
    }
    let isScActive = false
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
      const payload = jwt.verify(
        jwtToken,
        config.get('jwt.casinoGamePlaySecret')
      )
      const { isGameExist, userData: user } = payload

      if (!user) {
        throw new Error('PLAYER_NOT_FOUND')
      }
      if (user.isBan) {
        throw new Error('PLAYER_BLOCKED')
      }
      const [userWallet, checkTransaction] = await Promise.all([
        WalletModel.findOne({
          attributes: ['walletId', 'amount', 'currencyCode', 'ownerId', 'totalScCoin', 'gcCoin', 'scCoin'],
          where: { ownerId: userId },
          lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
          transaction
        }),
        CasinoTransactionModel.findOne({
          attributes: ['casinoTransactionId', 'transactionId', 'status', 'moreDetails', 'roundId', 'amount', 'gameId', 'beforeBalance', 'afterBalance', 'tournamentId'],
          where: {
            [Op.or]: [
              { transactionId: transactionId + '', actionType: ACTION.BET }
            ]
          },
          order: [['createdAt', 'DESC']],
          transaction
        })
      ])
      if (!userWallet) {  throw new Error('WALLET_NOT_FOUND') }

      const accountBalance = isScActive
        ? +round(+userWallet.totalScCoin, 2)
        : +round(+userWallet.gcCoin, 2)

      if (accountBalance < betAmount) {
        const insufficientBalanceError = new Error('INSUFFICIENT_FUNDS')
        insufficientBalanceError.error = 'low_balance'
        insufficientBalanceError.message =
          'You have insufficient balance to place a bet.'
        insufficientBalanceError.buttons = [
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
        throw insufficientBalanceError
      }

      const balance = isScActive ? +round(+userWallet.totalScCoin, 2) : +round(+userWallet.gcCoin, 2)

      if (!checkTransaction) {
        return {
          balance: isScActive ? +userWallet.totalScCoin : +userWallet.gcCoin
        }
      } else {
        if (checkTransaction.transactionId === transactionId || checkTransaction.status === CASINO_TRANSACTION_STATUS.ROLLBACK) {
          return {
            balance: isScActive ? +userWallet.totalScCoin : +userWallet.gcCoin
          }
        } else if (checkTransaction.transactionId === transactionId && (checkTransaction.moreDetails?.isBetWinBet === true) && checkTransaction.status === CASINO_TRANSACTION_STATUS.ROLLBACK) {
          return {
            balance: +afterBalance
          }
        }
      }
      checkTransaction.status = CASINO_TRANSACTION_STATUS.ROLLBACK

      await checkTransaction.save({ transaction })

      if (checkTransaction.moreDetails?.isBetWinBet === true) {
        const winTransaction = await CasinoTransactionModel.findOne({
          where: {
            transactionId: transactionId + '',
            actionType: { [Op.in]: [ACTION.WIN, ACTION.LOST] }
          }
        })

        if (!winTransaction) {
          return {
            balance: JSON.stringify(afterBalance)
          }
        }
        if (+winTransaction?.amount > balance) {
          return {
            balance: JSON.stringify(afterBalance)
          }
        }

        winTransaction.status = CASINO_TRANSACTION_STATUS.ROLLBACK
        await winTransaction.save({ transaction })

        const amount = +winTransaction?.amount

        if (isScActive) {
          beforeBalance = +balance
          afterBalance = +round(+minus(+beforeBalance, +amount), 2)
          if (+userWallet.scCoin.wsc >= +amount) {
            userWallet.scCoin = { ...userWallet.scCoin, wsc: +round(+minus(userWallet.scCoin.wsc, amount), 2) }
          } else {
            const remainingAmount = +round(+minus(+balance, +userWallet.scCoin.wsc), 2)
            userWallet.scCoin = { ...userWallet.scCoin, wsc: 0 }
            if (+userWallet.scCoin.psc >= +remainingAmount) {
              userWallet.scCoin = { ...userWallet.scCoin, psc: +round(+minus(+userWallet.scCoin.psc, +remainingAmount), 2) }
            } else {
              const leftoverBalance = +round(+minus(+remainingAmount, +userWallet.scCoin.psc), 2)
              userWallet.scCoin = { ...userWallet.scCoin, psc: 0 }
              if (+leftoverBalance > +userWallet.scCoin.bsc) {
                userWallet.scCoin = { ...userWallet.scCoin, bsc: 0 }
              } else {
                userWallet.scCoin = { ...userWallet, bsc: +round(+minus(+userWallet.scCoin.bsc, +leftoverBalance), 2) }
              }
            }
          }
        } else {
          beforeBalance = +balance
          afterBalance = +round(+minus(+balance, +amount), 2) > 0 ? +round(+minus(+balance, +amount), 2) : 0
          userWallet.gcCoin = +afterBalance
        }

        const winRollbackTransaction = {
          transactionId: transactionId + '',
          userId: userId,
          amount: +amount,
          gc: isScActive ? 0 : +amount,
          sc: isScActive ? +amount : 0,
          actionType: ACTION.ROLLBACK,
          actionId: ACTION_TYPE.DEBIT,
          gameId: isGameExist.masterCasinoGameId,
          roundId: checkTransaction.roundId,
          walletId: userWallet.walletId,
          currencyCode: userWallet.currencyCode,
          beforeBalance: beforeBalance,
          afterBalance: afterBalance,
          amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
          device: 'desktop',
          gameIdentifier: isGameExist.identifier,
          roundStatus: gameCycle.ends,
          status: CASINO_TRANSACTION_STATUS.COMPLETED,
          moreDetails,
          sessionId,
          tournamentId: checkTransaction.tournamentId
        }

        await CasinoTransactionModel.create(winRollbackTransaction, { transaction })
      }
      const amount = +checkTransaction.amount
      const updatedBalance = isScActive ? +round(+userWallet.totalScCoin, 2) : +round(+userWallet.gcCoin, 2)
      if (isScActive) {
        beforeBalance = +updatedBalance
        afterBalance = +round(+plus(+beforeBalance, +amount), 2)
        userWallet.scCoin = {
          ...userWallet.scCoin,
          bsc: +round(+plus(+userWallet.scCoin.bsc, +checkTransaction.moreDetails.bsc), 2),
          psc: +round(+plus(+userWallet.scCoin.psc, +checkTransaction.moreDetails.psc), 2),
          wsc: +round(+plus(+userWallet.scCoin.wsc, +checkTransaction.moreDetails.wsc), 2)
        }
        socketObj.scCoin = +afterBalance
      } else {
        beforeBalance = +updatedBalance
        afterBalance = +plus(+updatedBalance, +amount).toFixed(2)
        userWallet.gcCoin = +afterBalance
        socketObj.gcCoin = +afterBalance
      }

      await userWallet.save({ transaction })

      const transactionObj = {
        transactionId: transactionId + '',
        userId: userId,
        amount: +amount,
        actionType: ACTION.ROLLBACK,
        actionId: ACTION_TYPE.CREDIT,
        gc: isScActive ? 0 : +amount,
        sc: isScActive ? +amount : 0,
        gameId: +checkTransaction.gameId,
        roundId: checkTransaction.roundId,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        beforeBalance: beforeBalance,
        afterBalance: afterBalance,
        amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        device: 'desktop',
        gameIdentifier: isGameExist.identifier,
        roundStatus: gameCycle.ends,
        status: CASINO_TRANSACTION_STATUS.COMPLETED,
        moreDetails,
        sessionId,
        tournamentId: checkTransaction.tournamentId
      }

      await CasinoTransactionModel.create(transactionObj, { transaction })

      WalletEmitter.emitUserWalletBalance(socketObj, +userId)

      await transaction.commit()

      return {
        balance: isScActive ? +userWallet.totalScCoin : +userWallet.gcCoin
      }
    } catch (error) {
      console.error('Error in rollback Booming Casino Service', error)
      await transaction.rollback()
      throw new Error('INTERNAL_ERROR')
    }
  }
}
