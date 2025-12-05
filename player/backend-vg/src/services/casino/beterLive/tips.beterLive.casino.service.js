import ServiceBase from '../../serviceBase'
import { minus, plus, round } from 'number-precision'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import InsufficientBalanceEmitter from '../../../socket-resources/emitter/insufficientBalance.emitter'
import {
  ACTION,
  ACTION_TYPE,
  AMOUNT_TYPE,
  TRANSACTION_STATUS,
  CASINO_TRANSACTION_STATUS
} from '../../../utils/constants/constant'
import { getGamePlayRedisToken } from '../../../utils/common'
import {
  userDetailsAndVerification,
  BAD_REQUEST,
  TRANSACTION_ALREADY_PROCESSED,
  BET_DENIED,
  INSUFFICIENT_BALANCE,
  INTERNAL_ERROR,
  UNKNOWN_ERROR,
  TRANSACTION_NOT_FOUND,
  BET_MAX,
  scSum
} from './beterLive.helper'

export class TipsBeterLiveCasinoService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        Wallet: WalletModel,
        MasterCasinoGame: MasterCasinoGameModel,
        CasinoTransaction: CasinoTransactionModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const {
      casino,
      brand,
      playerId,
      transactionId,
      amount: tipAmount,
      promotionId
    } = this.args

    let beforeBalance = 0
    let afterBalance = 0

    const socketObj = {}
    const moreDetails = {
      bsc: 0,
      psc: 0,
      wsc: 0
    }

    try {
      if (+amount < 0) throw BAD_REQUEST

      const { userData, isScActive, isGameExist, coin, userId, tournamentId } =
        await userDetailsAndVerification(
          this.args,
          this.context.sequelizeTransaction
        )

      const checkTransaction = await CasinoTransactionModel.findOne({
        where: {
          transactionId: `${transactionId}` + ''
        },
        transaction
      })

      if (!checkTransaction) throw TRANSACTION_NOT_FOUND

      const userWallet = await WalletModel.findOne({
        where: { ownerId: userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })
      userWallet.reload({
        lock: {
          level: transaction.LOCK.UPDATE,
          of: WalletModel
        },
        transaction
      })
      const balance = isScActive ? +scSum(userWallet) : +userWallet.gcCoin

      if (isScActive) {
        let remainingAmount = 0
        beforeBalance = +balance
        if (+userWallet.scCoin.psc >= +tipAmount) {
          userWallet.scCoin = {
            ...userWallet.scCoin,
            psc: +round(+minus(+userWallet.scCoin.psc, +tipAmount), 2)
          }
          moreDetails.psc = +tipAmount
        } else {
          remainingAmount = +round(
            +minus(+tipAmount, +userWallet.scCoin.psc),
            2
          )
          moreDetails = { ...moreDetails, psc: +userWallet.scCoin.psc }
          userWallet.scCoin = { ...userWallet.scCoin, psc: 0 }

          if (+userWallet.scCoin.bsc >= remainingAmount) {
            userWallet.scCoin = {
              ...userWallet.scCoin,
              bsc: +round(+minus(+userWallet.scCoin.bsc, +tipAmount), 2)
            }
            moreDetails = { ...moreDetails, bsc: +remainingAmount }
          } else {
            remainingAmount = +round(
              +minus(+remainingAmount, +userWallet.scCoin.bsc),
              2
            )
            moreDetails = { ...moreDetails, bsc: +userWallet.scCoin.bsc }
            userWallet.scCoin = { ...userWallet.scCoin, bsc: 0 }

            if (+userWallet.scCoin.wsc < +remainingAmount) {
              InsufficientBalanceEmitter.insufficientBalance(socketObj, userId)
              return this.addError('InsufficientBalanceErrorType')
            }
            userWallet.scCoin = {
              ...userWallet.scCoin,
              wsc: +round(+minus(+userWallet.scCoin.wsc, +remainingAmount), 2)
            }
            moreDetails = { ...moreDetails, wsc: +remainingAmount }
          }
        }
        afterBalance = +round(+minus(+balance, +tipAmount), 2)
        socketObj = {
          ...socketObj,
          psc: +round(+userWallet.scCoin.psc, 2),
          bsc: +round(+userWallet.scCoin.bsc, 2),
          wsc: +round(+userWallet.scCoin.wsc, 2),
          scCoin: +scSum(userWallet)
        }
      } else {
        beforeBalance = +balance
        afterBalance = +round(+minus(+balance, +tipAmount), 2)
        userWallet.gcCoin = +afterBalance
        moreDetails.gcCoin = +tipAmount
        socketObj.gcCoin = +round(+userWallet.gcCoin, 2)
      }

      await userWallet.save({ transaction })

      const transactionObj = {
        transactionId: transactionId + '',
        userId: userId,
        amount: +tipAmount,
        actionId: ACTION_TYPE.DEBIT,
        actionType: ACTION.TIP,
        gameId: isGameExist.masterCasinoGameId,
        roundId: 'NULL',
        gc: isScActive ? 0 : +tipAmount,
        sc: isScActive ? +tipAmount : 0,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        beforeBalance: beforeBalance,
        afterBalance: afterBalance,
        amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        device: 'desktop',
        gameIdentifier: isGameExist.identifier,
        status: TRANSACTION_STATUS.SUCCESS,
        roundStatus: roundStatus === 'IN_PROGRESS' ? false : true,
        moreDetails
      }
      await CasinoTransactionModel.create(transactionObj, { transaction })
      WalletEmitter.emitUserWalletBalance(socketObj, userId)
      return {
        balance: afterBalance + ''
      }
    } catch (error) {
      console.log('error:', error)
      await transaction.rollback()
      if (error.status) throw error
      throw INTERNAL_ERROR
    }
  }
}
