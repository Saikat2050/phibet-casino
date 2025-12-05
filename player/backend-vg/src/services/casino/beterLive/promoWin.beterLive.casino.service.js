import { plus } from 'number-precision'
import Logger from '../../../libs/logger'
import ServiceBase from '../../serviceBase'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import InsufficientBalanceEmitter from '../../../socket-resources/emitter/insufficientBalance.emitter'
import { ACTION, ACTION_TYPE, AMOUNT_TYPE, TRANSACTION_STATUS } from '../../../utils/constants/constant'
import { BAD_REQUEST, INSUFFICIENT_BALANCE, INTERNAL_ERROR, scSum, userDetailsAndVerificationWithoutSession } from './beterLive.helper'

// This service is not correct and also closed as per requirements.
export class BeterLivePromoWinService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Wallet: WalletModel,
        CasinoTransaction: CasinoTransactionModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { transactionId, amount, promotionId } = this.args

    let beforeBalance = 0
    let afterBalance = 0

    const socketObj = {}
    const moreDetails = {
      bsc: 0,
      psc: 0,
      wsc: 0,
      promotionId,
      requestJSONString: this.args?.rawBody
    }

    try {
      if (+amount < 0) throw BAD_REQUEST

      const { isScActive, isGameExist, userId, accountBalance } = await userDetailsAndVerificationWithoutSession(this.args, this.context.sequelizeTransaction)

      const checkTransaction = await CasinoTransactionModel.findOne({
        where: {
          transactionId: `${transactionId}` + ''
        },
        transaction
      })

      if (checkTransaction) return { balance: +accountBalance }

      const userWallet = await WalletModel.findOne({
        where: { ownerId: userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      if (isScActive ? +scSum(userWallet) < +amount : +userWallet.gcCoin < +amount) {
        socketObj.insufficientBalance = true
        socketObj.coinType = isScActive ? 'scCoin' : 'gcCoin'
        InsufficientBalanceEmitter.insufficientBalance(socketObj, userId)
        throw INSUFFICIENT_BALANCE
      }

      const balance = isScActive ? +scSum(userWallet) : +userWallet.gcCoin

      if (isScActive) {
        beforeBalance = +balance
        afterBalance = +plus(+beforeBalance, +amount).toFixed(2)
        userWallet.scCoin = {
          ...userWallet.scCoin,
          bsc: +plus(+userWallet.scCoin.bsc, +amount).toFixed(2)
        }
        socketObj.scCoin = +afterBalance
        socketObj.bsc = +userWallet.scCoin.bsc
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
        gameId: isGameExist.masterCasinoGameId,
        roundId: 'NULL',
        gc: isScActive ? 0 : +amount,
        sc: isScActive ? +amount : 0,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        beforeBalance: beforeBalance,
        afterBalance: afterBalance,
        amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        device: 'desktop',
        gameIdentifier: isGameExist.identifier,
        status: TRANSACTION_STATUS.SUCCESS,
        roundStatus: true,
        actionType: ACTION.WIN,
        actionId: ACTION_TYPE.CREDIT,
        moreDetails
      }

      await CasinoTransactionModel.create(
        transactionObj,
        { transaction }
      )

      WalletEmitter.emitUserWalletBalance(socketObj, userId)

      return { balance: afterBalance }
    } catch (error) {
      if (error.status) throw error
      Logger.error('Error in Beter Live Promo Win Service', error)
      throw INTERNAL_ERROR
    }
  }
}
