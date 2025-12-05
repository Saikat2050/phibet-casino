import { Op } from 'sequelize'
import * as jwt from 'jsonwebtoken'
import ServiceBase from '../../serviceBase'
import socketServer from '../../../libs/socketServer'
import { sequelize } from '../../../db/models'
import { minus, round } from 'number-precision'
import InsufficientBalanceEmitter from '../../../socket-resources/emitter/insufficientBalance.emitter'
import { betSC, verifySignature } from './beterLive.helper'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import config from '../../../configs/app.config'
import { ACTION, ACTION_TYPE, AMOUNT_TYPE, TRANSACTION_STATUS } from '../../../utils/constants/constant'
import { resetSocketLoginToken } from '../../../utils/common'


export class BeterLiveBetService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Wallet: WalletModel,
        CasinoTransaction: CasinoTransactionModel
      }
    } = this.context

    const {
      amount,
      playerId,
      transactionId,
      launchAlias: identifier,
      sessionToken: sessionId,
      playerGameRoundCode: roundId
    } = this.args

    let beforeBalance = 0
    let afterBalance = 0
    const socketObj = {}
    let moreDetails = {
      bsc: 0,
      psc: 0,
      wsc: 0,
      requestJSONString: this.args?.rawBody
    }
    const sequelizeTransaction = await sequelize.transaction()

    try {
      if (+amount < 0) {
        await sequelizeTransaction.commit()
        return {
          status: 422,
          code: 'bad.request',
          message: 'Amount is less than 0'
        }
      }

      if (!verifySignature(this.args)) {
        return {
          status: 403,
          code: 'invalid.signature',
          message: 'Signature Incorrect'
        }
      }
      const jwtToken = await socketServer.redisClient.get(`gamePlay-${sessionId.split('_')[0]}`)

      if (!jwtToken) {
        await sequelizeTransaction.commit()
        return {
          status: 422,
          code: 'invalid.session.key',
          message: 'Session key is invalid or expired'
        }
      }

      const payload = jwt.verify(jwtToken, config.get('jwt.casinoGamePlaySecret'))

      if (!payload?.userId || !payload?.coin || !payload?.gameId) {
        await sequelizeTransaction.commit()
        return {
          status: 422,
          code: 'invalid.session.key',
          message: 'Session key is invalid or expired'
        }
      }

      const [userId, coin] = playerId.split('_')

      if (+payload.userId !== +userId || payload.coin !== coin) {
        await sequelizeTransaction.commit()
        return {
          status: 422,
          code: 'player.not.found',
          message: 'Player is not found'
        }
      }

      const { isGameExist, userData } = payload
      if (!isGameExist) {
        await sequelizeTransaction.commit()
        return {
          status: 422,
          code: 'unknown.game',
          message: 'Launch alias not found'
        }
      }

      if (!userData) {
        await sequelizeTransaction.commit()
        return {
          status: 422,
          code: 'player.not.found',
          message: 'Player is not found'
        }
      }

      const isScActive = coin === 'SC'

      const [checkTransaction, userWallet] = await Promise.all([
        CasinoTransactionModel.findOne({
          attributes: ['transactionId', 'roundId', 'roundStatus'],
          where: { [Op.or]: [{ transactionId: `${transactionId}` + '' }, { roundId: roundId + '', roundStatus: true }] },
          transaction: sequelizeTransaction
        }),
        WalletModel.findOne({
          attributes: ['ownerId', 'totalScCoin', 'scCoin', 'gcCoin', 'currencyCode', 'walletId'],
          where: { ownerId: userData.userId },
          lock: { level: sequelizeTransaction.LOCK.UPDATE, of: WalletModel },
          transaction: sequelizeTransaction
        })
      ])

      if (checkTransaction) {
        if (checkTransaction.transactionId === transactionId) {
          await sequelizeTransaction.commit()
          return {
            status: 200,
            code: 'transaction.already.processed',
            message: 'Provided Transaction has already been processed before'
          }
        }
        if (checkTransaction.roundId === roundId && checkTransaction.roundStatus === true) {
          await sequelizeTransaction.commit()
          return {
            status: 422,
            code: 'invalid.casino.behaviour',
            message: 'Unexpected casino logic behavior'
          }
        }
      }
      const balance = isScActive ? +round(+userWallet.totalScCoin, 2) : +round(+userWallet.gcCoin, 2)
      if (+balance < +amount) {
        socketObj.insufficientBalance = true
        socketObj.coinType = isScActive ? 'scCoin' : 'gcCoin'
        InsufficientBalanceEmitter.insufficientBalance(socketObj, userId)
        await sequelizeTransaction.commit()
        return {
          status: 422,
          code: 'insufficient.balance',
          message: 'Insufficient player balance'
        }
      }
      if (isScActive) {
        const data = betSC({ userWallet, betAmount: +amount, balance })
        if (data === 'IN_SUFFICIENT_BALANCE') {
          // This is a fallback condition, this is never met
          socketObj.insufficientBalance = true
          socketObj.coinType = isScActive ? 'scCoin' : 'gcCoin'
          InsufficientBalanceEmitter.insufficientBalance(socketObj, userId)
          await sequelizeTransaction.rollback()
          return {
            status: 422,
            code: 'insufficient.balance',
            message: 'Insufficient player balance'
          }
        }
        beforeBalance = +data.beforeBalance
        afterBalance = +data.afterBalance
        socketObj.scCoin = +afterBalance
        moreDetails = { ...moreDetails, ...data.moreDetails }
      } else {
        beforeBalance = +userWallet.gcCoin
        afterBalance = +round(+minus(+userWallet.gcCoin, +amount), 2)
        userWallet.gcCoin = +afterBalance
        socketObj.gcCoin = +afterBalance
      }
      const transactionObj = {
        transactionId: transactionId + '',
        userId,
        actionType: ACTION.BET,
        actionId: ACTION_TYPE.DEBIT,
        amount: amount,
        gc: isScActive ? 0 : +amount,
        sc: isScActive ? +amount : 0,
        gameId: isGameExist.masterCasinoGameId,
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
        roundStatus: false,
        status: TRANSACTION_STATUS.SUCCESS,
        moreDetails,
      }
      await Promise.all([
        CasinoTransactionModel.create(transactionObj, { transaction: sequelizeTransaction }),
        userWallet.save({ transaction: sequelizeTransaction }),
        resetSocketLoginToken({ key: `user:${sessionId.split('_')[0]}` })
      ])

      await sequelizeTransaction.commit()

      WalletEmitter.emitUserWalletBalance(socketObj, userId)

      return { balance: afterBalance }
    } catch (error) {
      console.log('Error in Beter Live Bet Service :', error)
      const transactionStatuses = ['commit', 'rollback']
      if (!~transactionStatuses.indexOf(sequelizeTransaction.finished)) await sequelizeTransaction.rollback()
      return {
        status: 422,
        code: 'error.internal',
        message: 'Internal error'
      }
    }
  }
}
