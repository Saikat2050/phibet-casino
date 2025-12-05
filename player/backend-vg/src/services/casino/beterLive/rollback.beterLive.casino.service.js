import * as jwt from 'jsonwebtoken'
import ServiceBase from '../../serviceBase'
import { plus, round } from 'number-precision'
import { sequelize } from '../../../db/models'
import config from '../../../configs/app.config'
import { verifySignature } from './beterLive.helper'
import socketServer from '../../../libs/socketServer'
import { ACTION, ACTION_TYPE, AMOUNT_TYPE, CASINO_TRANSACTION_STATUS } from '../../../utils/constants/constant'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'

export class BeterLiveRollBackService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        Wallet: WalletModel,
        MasterCasinoGame: MasterCasinoGameModel,
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
    const moreDetails = {
      wsc: 0,
      psc: 0,
      bsc: 0,
      requestJSONString: this.args?.rawBody
    }
    const socketObj = {}
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
        await sequelizeTransaction.commit()
        return {
          status: 403,
          code: 'invalid.signature',
          message: 'Signature Incorrect'
        }
      }

      const [userId, coin] = playerId.split('_')

      let payload
      const jwtToken = await socketServer.redisClient.get(`gamePlay-${sessionId.split('_')[0]}`)
      if (!jwtToken) payload = await socketServer.redisClient.get(`gameSession:${sessionId}`) // Fallback session key valid till 2 days
      else payload = jwt.verify(jwtToken, config.get('jwt.casinoGamePlaySecret'))
      if (!payload) { // Most probably this condition won't occur ever
        const [game, user] = await Promise.all([
          await MasterCasinoGameModel.findOne({
            attributes: ['masterCasinoGameId', 'identifier'],
            where: { identifier: String(identifier) },
            transaction: sequelizeTransaction,
            raw: true
          }),
          UserModel.findOne({
            attributes: [[sequelize.literal('1'), 'exists']],
            where: { userId: userId },
            transaction: sequelizeTransaction
          })
        ])
        if (!game) {
          await sequelizeTransaction.commit()
          return {
            status: 422,
            code: 'unknown.game',
            message: 'Launch alias not found'
          }
        }

        if (!user) {
          await sequelizeTransaction.commit()
          return {
            status: 200,
            code: 'player.not.found',
            message: 'Player is not found'
          }
        }
        // Create payload from these
        payload = { userId, coin, gameId: game.masterCasinoGameId, isGameExist: game, userData: user }
      }

      if (!payload?.userId || !payload?.coin || !payload?.gameId) {
        await sequelizeTransaction.commit()
        return {
          status: 422,
          code: 'invalid.session.key',
          message: 'Session key is invalid or expired'
        }
      }

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
          status: 200,
          code: 'player.not.found',
          message: 'Player is not found'
        }
      }

      const isScActive = coin === 'SC'

      const [isBetPlaced, userWallet] = await Promise.all([
        CasinoTransactionModel.findOne({
          where: { actionType: ACTION.BET, roundId: roundId + '', userId },
          transaction: sequelizeTransaction
        }),
        WalletModel.findOne({
          attributes: ['walletId', 'ownerId', 'totalScCoin', 'scCoin', 'gcCoin', 'currencyCode'],
          where: { ownerId: userId },
          lock: { level: sequelizeTransaction.LOCK.UPDATE, of: WalletModel },
          transaction: sequelizeTransaction
        })
      ])

      const accountBalance = isScActive ? +round(+userWallet.totalScCoin, 2) : +round(+userWallet.gcCoin, 2)

      if (!isBetPlaced) {
        await sequelizeTransaction.commit()
        return {
          status: 422,
          code: 'invalid.transaction.id',
          message: 'Unexpected transaction id'
        }
      }

      if (isBetPlaced.status === CASINO_TRANSACTION_STATUS.ROLLBACK) {
        await sequelizeTransaction.commit()
        return { balance: +accountBalance }
      }

      isBetPlaced.status = CASINO_TRANSACTION_STATUS.ROLLBACK

      const balance = isScActive ? +round(+userWallet.totalScCoin, 2) : +round(+userWallet.gcCoin, 2)
      beforeBalance = +balance
      afterBalance = +round(plus(+beforeBalance, amount), 2)

      if (isScActive) {
        userWallet.scCoin = {
          ...userWallet.scCoin,
          bsc: +round(+plus(+userWallet.scCoin.bsc, +isBetPlaced.moreDetails.bsc), 2),
          psc: +round(+plus(+userWallet.scCoin.psc, +isBetPlaced.moreDetails.psc), 2),
          wsc: +round(+plus(+userWallet.scCoin.wsc, +isBetPlaced.moreDetails.wsc), 2)
        }
        socketObj.scCoin = +afterBalance
      } else {
        userWallet.gcCoin = +afterBalance
        socketObj.gcCoin = +afterBalance
      }

      const transactionObj = {
        transactionId: transactionId + '',
        userId: userId,
        amount: +amount,
        gc: isScActive ? 0 : +amount,
        sc: isScActive ? +amount : 0,
        actionType: ACTION.ROLLBACK,
        actionId: ACTION_TYPE.CREDIT,
        gameId: +isBetPlaced.gameId,
        roundId: roundId,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        beforeBalance: beforeBalance,
        afterBalance: afterBalance,
        amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        device: 'desktop',
        gameIdentifier: identifier,
        status: CASINO_TRANSACTION_STATUS.COMPLETED,
        roundStatus: false,
        moreDetails
      }

      await Promise.all([
        CasinoTransactionModel.create(transactionObj, { transaction: sequelizeTransaction }),
        isBetPlaced.save({ transaction: sequelizeTransaction }),
        userWallet.save({ transaction: sequelizeTransaction })
      ])

      await sequelizeTransaction.commit()
      WalletEmitter.emitUserWalletBalance(socketObj, userId)
      return { balance: +afterBalance }
    } catch (error) {
      console.log('Error in Beter Live Rollback Service', error)
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
