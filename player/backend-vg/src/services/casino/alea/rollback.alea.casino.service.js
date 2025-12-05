import { Op } from 'sequelize'
import * as jwt from 'jsonwebtoken'
import ServiceBase from '../../serviceBase'
import { sequelize } from '../../../db/models'
import { plus, minus, round } from 'number-precision'
import { setGamePlayRedisToken } from '../../../utils/common'
import { ACTION, ACTION_TYPE, AMOUNT_TYPE, CASINO_TRANSACTION_STATUS } from '../../../utils/constants/constant'
import { INTERNAL_ERROR, INVALID_CURRENCY, INVALID_SIGNATURE, PLAYER_NOT_FOUND, ROLLBACK_GAME_NOT_FOUND, UNKNOWN_ERROR, scSum, verifySignature } from './alea.helper'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import socketServer from '../../../libs/socketServer'
import config from '../../../configs/app.config'

export class RollBackAleaCasinoService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Wallet: WalletModel,
        CasinoTransaction: CasinoTransactionModel
      }
    } = this.context

    const {
      player: { casinoPlayerId: playerId },
      currency,
      id: transactionId,
      transaction: { id: betTransactionId },
      game: { id: identifier },
      round: { status: roundStatus = false } = {},
      casinoSessionId: sessionId
    } = this.args

    let beforeBalance = 0
    let afterBalance = 0
    const socketObj = {}
    const moreDetails = {
      wsc: 0,
      psc: 0,
      bsc: 0,
      providerTransactionId: this?.args?.integratorTransactionId,
      providerPlayerId: this?.args?.player?.id,
      requestJSONString: this.args.stringData
    }

    const transaction = await sequelize.transaction()

    try {
      if (!verifySignature(this.args)) {
        await transaction.commit()

        return INVALID_SIGNATURE
      }

      const jwtToken = await socketServer.redisClient.get(`gamePlay-${sessionId.split('_')[0]}`)

      if (!jwtToken) {
        await transaction.commit()

        return {
          statusCode: 500,
          status: 'ERROR',
          code: 'INVALID_REQUEST',
          message: 'Game Session Expired'
        }
      }

      const payload = jwt.verify(jwtToken, config.get('jwt.casinoGamePlaySecret'))

      if (!payload?.userId || !payload?.coin || !payload?.gameId) {
        await transaction.commit()

        return {
          statusCode: 500,
          status: 'ERROR',
          code: 'INVALID_REQUEST',
          message: 'Game Session Expired'
        }
      }

      if (+payload.identifier !== +identifier) {
        await transaction.commit()

        return ROLLBACK_GAME_NOT_FOUND
      }

      const [userId, coin] = playerId.split('_')

      if (!+userId) {
        await transaction.commit()

        return PLAYER_NOT_FOUND
      }
      if (currency !== coin) {
        await transaction.commit()

        return INVALID_CURRENCY
      }

      // if (sessionId && !isSessionExist) {
      //   console.log('Alea Play session not found', sessionId)
      //   await transaction.commit()
      //   return SESSION_EXPIRED
      // }

      const isScActive = coin === 'SC'
      const userWallet = await WalletModel.findOne({
        where: { ownerId: userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })
      let balance = isScActive ? +scSum(userWallet) : +userWallet.gcCoin

      const checkTransaction = await CasinoTransactionModel.findOne({
        attributes: ['casinoTransactionId', 'transactionId', 'status', 'moreDetails', 'roundId', 'amount', 'gameId', 'beforeBalance', 'afterBalance'],
        where: {
          [Op.or]: [
            {
              transactionId: transactionId + ''
            },
            {
              transactionId: betTransactionId + '',
              actionType: ACTION.BET
            }
          ]
        },
        order: [['createdAt', 'DESC']],
        transaction
      })
      if (!checkTransaction) {
        await setGamePlayRedisToken({ key: betTransactionId, token: 'CANCELLED' })
        await transaction.commit()

        return {
          statusCode: 200,
          realBalance: balance,
          bonusBalance: 0,
          isNotFound: true
        }
      } else {
        if (checkTransaction.transactionId === transactionId || checkTransaction.status === CASINO_TRANSACTION_STATUS.ROLLBACK) {
          await transaction.commit()

          return {
            statusCode: 200,
            realBalance: checkTransaction?.afterBalance,
            bonusBalance: 0,
            isAlreadyProcessed: true
          }
        } else if (checkTransaction.transactionId === betTransactionId && checkTransaction.moreDetails?.isBetWinBet && checkTransaction.moreDetails.isBetWinBet !== true && checkTransaction.status === CASINO_TRANSACTION_STATUS.ROLLBACK) {
          return {
            statusCode: 200,
            realBalance: checkTransaction?.beforeBalance,
            bonusBalance: 0,
            isAlreadyProcessed: true
          }
        } else if (checkTransaction.transactionId === betTransactionId && (checkTransaction.moreDetails?.isBetWinBet === true) && checkTransaction.status === CASINO_TRANSACTION_STATUS.ROLLBACK) {
          return {
            statusCode: 200,
            realBalance: checkTransaction?.beforeBalance,
            bonusBalance: 0,
            isAlreadyProcessed: true
          }
        }
      }
      checkTransaction.status = CASINO_TRANSACTION_STATUS.ROLLBACK

      await checkTransaction.save({ transaction })

      if (checkTransaction.moreDetails?.isBetWinBet === true) {
        const winTransaction = await CasinoTransactionModel.findOne({
          where: {
            transactionId: betTransactionId + '',
            actionType: { [Op.in]: [ACTION.WIN, ACTION.LOST] }
          }
        })

        if (+winTransaction.amount > balance) {
          await transaction.commit()

          return UNKNOWN_ERROR
        }

        winTransaction.status = CASINO_TRANSACTION_STATUS.ROLLBACK

        await winTransaction.save({ transaction })

        const amount = +winTransaction.amount

        if (isScActive) {
          beforeBalance = +balance
          afterBalance = +minus(+beforeBalance, +amount)
          if (+userWallet.scCoin.wsc >= +amount) {
            userWallet.scCoin = {
              ...userWallet.scCoin,
              wsc: +minus(userWallet.scCoin.wsc, amount).toFixed(2)
            }
          } else {
            const remainingAmount = +minus(
              +balance,
              +userWallet.scCoin.wsc
            ).toFixed(2)
            userWallet.scCoin = {
              ...userWallet.scCoin,
              wsc: 0
            }
            if (+userWallet.scCoin.psc >= +remainingAmount) {
              userWallet.scCoin = {
                ...userWallet.scCoin,
                psc: +minus(+userWallet.scCoin.psc, +remainingAmount).toFixed(2)
              }
            } else {
              const leftoverBalance = +minus(
                +remainingAmount,
                +userWallet.scCoin.psc
              ).toFixed(2)
              userWallet.scCoin = {
                ...userWallet.scCoin,
                psc: 0
              }
              if (+leftoverBalance > +userWallet.scCoin.bsc) {
                userWallet.scCoin = {
                  ...userWallet.scCoin,
                  bsc: 0
                }
              } else {
                userWallet.scCoin = {
                  ...userWallet,
                  bsc: +minus(+userWallet.scCoin.bsc, +leftoverBalance).toFixed(
                    2
                  )
                }
              }
            }
          }
        } else {
          beforeBalance = +balance
          afterBalance =
            +minus(+balance, +amount).toFixed(2) > 0
              ? +minus(+balance, +amount).toFixed(2)
              : 0
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
          gameId: +checkTransaction.gameId,
          roundId: checkTransaction.roundId,
          walletId: userWallet.walletId,
          currencyCode: userWallet.currencyCode,
          beforeBalance: beforeBalance,
          afterBalance: afterBalance,
          amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
          device: 'desktop',
          gameIdentifier: identifier,
          roundStatus: roundStatus === 'COMPLETED',
          status: CASINO_TRANSACTION_STATUS.COMPLETED,
          moreDetails,
          sessionId
        }

        await CasinoTransactionModel.create(winRollbackTransaction, {
          transaction
        })
        balance = isScActive ? +scSum(userWallet) : +userWallet.gcCoin
      }
      const amount = +checkTransaction.amount

      if (isScActive) {
        beforeBalance = +balance
        afterBalance = +round(+plus(+beforeBalance, +amount), 2)
        userWallet.scCoin = {
          ...userWallet.scCoin,
          bsc: +round(+plus(+userWallet.scCoin.bsc, +checkTransaction.moreDetails.bsc), 2),
          psc: +round(+plus(+userWallet.scCoin.psc, +checkTransaction.moreDetails.psc), 2),
          wsc: +round(+plus(+userWallet.scCoin.wsc, +checkTransaction.moreDetails.wsc), 2)
        }
        socketObj.scCoin = +afterBalance
      } else {
        beforeBalance = +balance
        afterBalance = +plus(+balance, +amount).toFixed(2)
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
        gameIdentifier: identifier,
        roundStatus: roundStatus === 'COMPLETED',
        status: CASINO_TRANSACTION_STATUS.COMPLETED,
        moreDetails,
        sessionId
      }

      await CasinoTransactionModel.create(transactionObj, { transaction })

      WalletEmitter.emitUserWalletBalance(socketObj, +userId)

      await transaction.commit()

      return {
        realBalance: afterBalance,
        bonusBalance: 0.0
      }
    } catch (error) {
      console.log('Error in Alea Play Rollback Service', error)
      const transactionStatuses = ['commit', 'rollback']
      if (!(~transactionStatuses.indexOf(transaction.finished))) { await transaction.rollback() }

      return INTERNAL_ERROR
    }
  }
}
