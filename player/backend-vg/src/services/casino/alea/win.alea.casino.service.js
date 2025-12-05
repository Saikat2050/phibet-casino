import { Op } from 'sequelize'
import * as jwt from 'jsonwebtoken'
import { plus } from 'number-precision'
import ServiceBase from '../../serviceBase'
import { sequelize } from '../../../db/models'
import { ACTION, ACTION_TYPE, AMOUNT_TYPE, CASINO_TRANSACTION_STATUS, TRANSACTION_STATUS } from '../../../utils/constants/constant'
import { INTERNAL_ERROR, INVALID_CURRENCY, INVALID_SIGNATURE, PLAYER_NOT_FOUND, UNKNOWN_ERROR, scSum, verifySignature } from './alea.helper'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import socketServer from '../../../libs/socketServer'
import config from '../../../configs/app.config'

export class WinAleaCasinoService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Wallet: WalletModel,
        CasinoTransaction: CasinoTransactionModel
      }
    } = this.context
    const {
      amount,
      currency,
      id: transactionId,
      game: { id: identifier },
      player: { casinoPlayerId: playerId },
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
      bscWin: 0,
      providerTransactionId: this?.args?.integratorTransactionId,
      providerPlayerId: this?.args?.player?.id,
      requestJSONString: this.args.stringData
    }

    const transaction = await sequelize.transaction()

    try {
      if (+amount < 0) {
        await transaction.commit()

        return UNKNOWN_ERROR
      }

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
        return {
          statusCode: 500,
          status: 'ERROR',
          code: 'INVALID_REQUEST',
          message: 'This game could not be found in the casino.'
        }
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

      const isScActive = coin === 'SC'
      const userWallet = await WalletModel.findOne({
        where: { ownerId: userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      const balance = isScActive ? +scSum(userWallet) : +userWallet.gcCoin
      const checkTransaction = await CasinoTransactionModel.findOne({
        attributes: ['casinoTransactionId', 'transactionId', 'roundId', 'roundStatus', 'actionType', 'status', 'gameId', 'sessionId', 'amount', 'moreDetails'],
        where: {
          userId,
          [Op.or]: [
            {
              actionType: [ACTION.WIN, ACTION.LOST],
              [Op.or]: [
                { transactionId: `${transactionId}` + '' },
                { roundId: roundId + '', roundStatus: true }
              ]
            },
            {
              roundId: roundId + '',
              actionType: ACTION.BET
            }
          ]
        },
        order: [['createdAt', 'DESC']],
        transaction
      })

      if (!checkTransaction) {
        await transaction.commit()

        return UNKNOWN_ERROR
      } else {
        if (checkTransaction.transactionId === transactionId + '') {
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
        if (checkTransaction.roundId === roundId + '' && checkTransaction.roundStatus) {
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
        if (checkTransaction.actionType !== ACTION.BET) {
          await transaction.commit()

          return {
            statusCode: 200,
            realBalance: balance,
            bonusBalance: 0,
            realAmount: balance,
            bonusAmount: 0.0,
            isAlreadyProcessed: true
          }
        }
      }

      if (roundStatus === 'COMPLETED') {
        await CasinoTransactionModel.update(
          {
            roundStatus: true
          },
          {
            where: {
              roundId: roundId + ''
            },
            transaction
          }
        )
      }

      checkTransaction.status = CASINO_TRANSACTION_STATUS.COMPLETED

      await checkTransaction.save({ transaction })

      if (isScActive) {
        beforeBalance = +balance
        afterBalance = +plus(+beforeBalance, +amount).toFixed(2)
        userWallet.scCoin = {
          ...userWallet.scCoin,
          wsc: +plus(+userWallet.scCoin.wsc, +amount).toFixed(2)
        }
        socketObj.scCoin = +afterBalance
        socketObj.wsc = +userWallet.scCoin.wsc
        moreDetails.bscWin = (+checkTransaction?.moreDetails?.bsc * +amount) / +checkTransaction?.amount
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
        gameId: +checkTransaction.gameId,
        roundId: roundId,
        gc: isScActive ? 0 : +amount,
        sc: isScActive ? +amount : 0,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        beforeBalance: beforeBalance,
        afterBalance: afterBalance,
        amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        device: 'desktop',
        gameIdentifier: identifier,
        status: TRANSACTION_STATUS.SUCCESS,
        roundStatus: roundStatus === 'COMPLETED',
        moreDetails,
        sessionId: checkTransaction.sessionId
      }
      if (+amount === 0) {
        transactionObj.actionType = ACTION.LOST
        transactionObj.actionId = ACTION_TYPE.LOST
      } else {
        transactionObj.actionType = ACTION.WIN
        transactionObj.actionId = ACTION_TYPE.CREDIT
      }

      const winTransaction = await CasinoTransactionModel.create(
        transactionObj,
        { transaction }
      )

      await transaction.commit()
      WalletEmitter.emitUserWalletBalance(socketObj, userId)

      return {
        id: winTransaction?.casinoTransactionId,
        realBalance: afterBalance,
        bonusBalance: 0.0,
        realAmount: amount,
        bonusAmount: 0.0
      }
    } catch (error) {
      console.log('Error in Alea Play Win Transaction', error)
      const transactionStatuses = ['commit', 'rollback']
      if (!(~transactionStatuses.indexOf(transaction.finished))) { await transaction.rollback() }

      return INTERNAL_ERROR
    }
  }
}
