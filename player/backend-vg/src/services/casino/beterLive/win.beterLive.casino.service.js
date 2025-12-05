import { Op } from 'sequelize'
import * as jwt from 'jsonwebtoken'
import ServiceBase from '../../serviceBase'
import { sequelize } from '../../../db/models'
import { plus, round } from 'number-precision'
import config from '../../../configs/app.config'
import { verifySignature } from './beterLive.helper'
import socketServer from '../../../libs/socketServer'
import { ACTION, ACTION_TYPE, AMOUNT_TYPE, CASINO_TRANSACTION_STATUS, TRANSACTION_STATUS } from '../../../utils/constants/constant'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
export class BeterLiveWinService extends ServiceBase {
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
      gameResultUrl,
      launchAlias: identifier,
      sessionToken: sessionId,
      playerGameRoundCode: roundId
    } = this.args

    let beforeBalance = 0
    let afterBalance = 0
    const socketObj = {}
    const moreDetails = {
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
            attributes: ['masterCasinoGameId', 'identifier', ['name', 'gameName']],
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
            status: 422,
            code: 'player.not.found',
            message: 'Player is not found'
          }
        }
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

      const [userWallet, checkTransaction] = await Promise.all([
        WalletModel.findOne({
          attributes: ['ownerId', 'totalScCoin', 'scCoin', 'gcCoin', 'walletId', 'currencyCode'],
          where: { ownerId: userId },
          lock: { level: sequelizeTransaction.LOCK.UPDATE, of: WalletModel },
          transaction: sequelizeTransaction
        }),
        CasinoTransactionModel.findOne({
          attributes: ['casinoTransactionId', 'transactionId', 'roundId', 'roundStatus', 'actionType', 'status', 'gameId', 'sessionId', 'amount', 'moreDetails'],
          where: {
            userId,
            [Op.or]: [
              {
                actionType: [ACTION.WIN, ACTION.LOST],
                [Op.or]: [{ transactionId: `${transactionId}` + '' }, { roundId: roundId + '', roundStatus: true }]
              },
              { roundId: roundId + '', actionType: ACTION.BET }
            ]
          },
          transaction: sequelizeTransaction
        })
      ])
      const accountBalance = isScActive ? +round(+userWallet.totalScCoin, 2) : +round(+userWallet.gcCoin, 2)

      if (!checkTransaction) {
        await sequelizeTransaction.commit()
        return {
          status: 422,
          code: 'invalid.casino.behaviour',
          message: 'Unexpected casino logic behavior'
        }
      } else {
        if (checkTransaction.transactionId === String(transactionId) && checkTransaction.actionType === ACTION.BET) {
          await sequelizeTransaction.commit()
          return {
            status: 422,
            code: 'invalid.transaction.id',
            message: 'Unexpected transaction id'
          }
        } else if (checkTransaction.roundId === roundId + '' && checkTransaction.roundStatus) {
          await sequelizeTransaction.commit()
          return { balance: accountBalance }
        } else if (checkTransaction.actionType !== ACTION.BET) {
          await sequelizeTransaction.commit()
          return {
            status: 422,
            code: 'invalid.casino.behaviour',
            message: 'Unexpected casino logic behavior'
          }
        }
      }

      checkTransaction.status = CASINO_TRANSACTION_STATUS.COMPLETED

      if (isScActive) {
        beforeBalance = +accountBalance
        afterBalance = +round(+plus(+beforeBalance, +amount), 2)
        userWallet.scCoin = {
          ...userWallet.scCoin,
          wsc: +round(+plus(+userWallet.scCoin.wsc, +amount), 2)
        }
        socketObj.scCoin = +afterBalance
        socketObj.wsc = +userWallet.scCoin.wsc
        socketObj.winDetails = {
          amount: +round(+amount, 2),
          gameId: payload.isGameExist.masterCasinoGameId,
          gameName: payload.isGameExist.gameName,
          currency: 'USD'
        }
        moreDetails.bscWin = (+checkTransaction?.moreDetails?.bsc * +amount) / +checkTransaction?.amount
      } else {
        beforeBalance = +accountBalance
        afterBalance = +round(+plus(+accountBalance, +amount), 2)
        userWallet.gcCoin = +afterBalance
        socketObj.gcCoin = +afterBalance
      }
      moreDetails.gameResultUrl = gameResultUrl

      let transactionObj = {
        transactionId: transactionId + '',
        userId: userId,
        amount: +amount,
        gameId: isGameExist.masterCasinoGameId,
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
        roundStatus: true,
        moreDetails
      }

      if (+amount === 0) {
        transactionObj = {
          ...transactionObj,
          actionType: ACTION.LOST,
          actionId: ACTION_TYPE.LOST
        }
      } else {
        transactionObj = {
          ...transactionObj,
          actionType: ACTION.WIN,
          actionId: ACTION_TYPE.CREDIT
        }
      }

      await Promise.all([
        CasinoTransactionModel.create(transactionObj, { transaction: sequelizeTransaction }),
        userWallet.save({ transaction: sequelizeTransaction }),
        CasinoTransactionModel.update({ roundStatus: true }, { where: { roundId: String(roundId) }, transaction: sequelizeTransaction }),
        checkTransaction.save({ transaction: sequelizeTransaction })
      ])

      await sequelizeTransaction.commit()
      WalletEmitter.emitUserWalletBalance(socketObj, userId)
      return { balance: +afterBalance }
    } catch (error) {
      console.log('Error in Beter Live Win Service :', error)
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
