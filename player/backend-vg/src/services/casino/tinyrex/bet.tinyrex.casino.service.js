import { Op } from 'sequelize'
import ServiceBase from '../../serviceBase'
import { minus, round } from 'number-precision'
import InsufficientBalanceEmitter from '../../../socket-resources/emitter/insufficientBalance.emitter'
import { betSC } from './tinyrex.helper'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import { ACTION, ACTION_TYPE, AMOUNT_TYPE, TRANSACTION_STATUS } from '../../../utils/constants/constant'

export class TinyrexBetService extends ServiceBase {
  async run() {
    const {
      dbModels: {
        Wallet: WalletModel,
        CasinoTransaction: CasinoTransactionModel,
        MasterCasinoGame: MasterCasinoGameModel
      },
      sequelizeTransaction
    } = this.context

    const {
      amount,
      transactionId,
      gameRoundCode: roundId,
      userId,
      currencyCode,
      gameId,
      rawBody
    } = this.args

    if (+amount < 0) {
      return {
        status: 422,
        code: 'bad.request',
        message: 'Amount is less than 0'
      }
    }

    const game = await MasterCasinoGameModel.findOne({
      where: { identifier: gameId },
      transaction: sequelizeTransaction
    })
    if (!game) {
      return {
        status: 422,
        code: 'unknown.game',
        message: 'Launch alias not found'
      }
    }

    try {
      const isScActive = currencyCode === 'SC'

      const [checkTransaction, userWallet] = await Promise.all([
        CasinoTransactionModel.findOne({
          attributes: ['transactionId', 'roundId', 'roundStatus'],
          where: {
            [Op.or]: [
              { transactionId: `${transactionId}` },
              { roundId: `${roundId}`, roundStatus: true }
            ]
          },
          transaction: sequelizeTransaction
        }),
        WalletModel.findOne({
          attributes: ['ownerId', 'totalScCoin', 'scCoin', 'gcCoin', 'currencyCode', 'walletId'],
          where: { ownerId: userId },
          lock: { level: sequelizeTransaction.LOCK.UPDATE, of: WalletModel },
          transaction: sequelizeTransaction
        })
      ])

      if (checkTransaction) {
        const isDuplicateTransaction = checkTransaction.transactionId === `${transactionId}`
        const isRoundSettled = checkTransaction.roundId === `${roundId}` && checkTransaction.roundStatus === true

        await sequelizeTransaction.commit()
        return isDuplicateTransaction
          ? {
            status: 200,
            code: 'transaction.already.processed',
            message: 'Provided Transaction has already been processed before'
          }
          : {
            status: 422,
            code: 'invalid.casino.behaviour',
            message: 'Unexpected casino logic behavior'
          }
      }

      const balance = isScActive ? +round(+userWallet.totalScCoin, 2) : +round(+userWallet.gcCoin, 2)

      if (+balance < +amount) {
        const socketObj = {
          insufficientBalance: true,
          coinType: isScActive ? 'scCoin' : 'gcCoin'
        }
        InsufficientBalanceEmitter.insufficientBalance(socketObj, userId)
        await sequelizeTransaction.commit()
        return {
          status: 422,
          code: 'insufficient.balance',
          message: 'Insufficient player balance'
        }
      }

      let beforeBalance = 0
      let afterBalance = 0
      const socketObj = {}
      const moreDetails = {
        bsc: 0,
        psc: 0,
        wsc: 0,
        requestJSONString: rawBody
      }

      if (isScActive) {
        const data = betSC({ userWallet, betAmount: +amount, balance })

        if (data === 'IN_SUFFICIENT_BALANCE') {
          const socketObj = {
            insufficientBalance: true,
            coinType: 'scCoin'
          }
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
        Object.assign(moreDetails, data.moreDetails)
      } else {
        beforeBalance = +userWallet.gcCoin
        afterBalance = +round(+minus(+userWallet.gcCoin, +amount), 2)
        userWallet.gcCoin = +afterBalance
        socketObj.gcCoin = +afterBalance
      }

      const transactionObj = {
        transactionId: `${transactionId}`,
        userId,
        actionType: ACTION.BET,
        actionId: ACTION_TYPE.DEBIT,
        amount: +amount,
        gc: isScActive ? 0 : +amount,
        sc: isScActive ? +amount : 0,
        gameId: game.masterCasinoGameId,
        roundId: `${roundId}`,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        beforeBalance,
        afterBalance,
        amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        device: 'desktop',
        createdAt: new Date(),
        updatedAt: new Date(),
        gameIdentifier: gameId,
        roundStatus: false,
        status: TRANSACTION_STATUS.SUCCESS,
        moreDetails
      }

      await Promise.all([
        CasinoTransactionModel.create(transactionObj, { transaction: sequelizeTransaction }),
        userWallet.save({ transaction: sequelizeTransaction })
      ])

      await sequelizeTransaction.commit()
      WalletEmitter.emitUserWalletBalance(socketObj, userId)

      return { balance: afterBalance }
    } catch (error) {
      console.log('Error in Bet Service :', error)
      if (!['commit', 'rollback'].includes(sequelizeTransaction.finished)) await sequelizeTransaction.rollback()
      return {
        status: 422,
        code: 'error.internal',
        message: 'Internal error'
      }
    }
  }
}
