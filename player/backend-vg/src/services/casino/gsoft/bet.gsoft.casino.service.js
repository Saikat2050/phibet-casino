import { minus } from 'number-precision'
import Logger from '../../../libs/logger'
import ServiceBase from '../../serviceBase'
import { checkBetLimit } from '../../../utils/responsibleGambling'
import { updateUserTierDetail } from '../../../helpers/tiers.helper'
import { raffleHelper } from '../../../helpers/raffle.helper'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import InsufficientBalanceEmitter from '../../../socket-resources/emitter/insufficientBalance.emitter'
import { ACTION, ACTION_TYPE, AMOUNT_TYPE, TRANSACTION_STATUS } from '../../../utils/constants/constant'
import { BET_LIMIT_EXCEEDED, INSUFFICIENT_BALANCE, OPT_NOT_ALLOWED, ROUND_CLOSED, TECHNICAL_ERROR, scSum, userVerificationAndDetails } from './helper.gsoft.casino'
export class BetGSoftCasinoService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Wallet: WalletModel,
        CasinoTransaction: CasinoTransactionModel
      },
      sequelizeTransaction: transaction
    } = this.context

    let beforeBalance = 0
    let afterBalance = 0
    let freeSpinTotalAmount = 0
    const socketObj = {}
    const moreDetails = {
      bsc: 0,
      psc: 0,
      wsc: 0
    }

    const {
      accountid: accountId,
      apiversion,
      betamount: amount,
      gameid: identifier,
      gamesessionid,
      roundid: roundId,
      frbid: freeBonusId,
      transactionid: transactionId,
      device
    } = this.args

    try {
      if (+amount < 0) throw OPT_NOT_ALLOWED(apiversion)

      const { userData, isScActive, isGameExist, coin, userId, tournamentId } =
        await userVerificationAndDetails(
          {
            sessionId: gamesessionid,
            accountId: accountId,
            apiVersion: apiversion
          },
          transaction
        )

      if (coin === 'SC') {
        const limitCheck = await checkBetLimit({
          userId,
          betAmount: parseFloat(amount)
        })
        if (limitCheck.limitReached) throw BET_LIMIT_EXCEEDED(apiversion)
      }

      const userWallet = await WalletModel.findOne({
        where: { ownerId: userData.userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      const checkTransaction = await CasinoTransactionModel.findOne({
        where: {
          transactionId: `${transactionId}` + ''
        },
        transaction
      })

      if (checkTransaction) {
        if (
          accountId ===
            `${checkTransaction.userId}_${
              checkTransaction.amountType === 1 ? 'SC' : 'GC'
            }` ||
          (freeBonusId ? 0 : +amount) === +checkTransaction.amount
        ) {
          return {
            code: 200,
            status: 'Success - duplicate request',
            accounttransactionid: checkTransaction.casinoTransactionId,
            apiversion,
            balance: isScActive ? +scSum(userWallet) : +userWallet.gcCoin,
            bonusmoneybet: 0,
            game_mode: 1,
            real_balance: isScActive ? +scSum(userWallet) : +userWallet.gcCoin,
            realmoneybet: +amount
          }
        } else {
          return { status: 'Transaction parameter mismatch' }
        }
      }

      const checkRound = await CasinoTransactionModel.findOne({
        where: { roundId: roundId + '', roundStatus: true },
        transaction
      })

      if (checkRound) throw ROUND_CLOSED(apiversion)

      if (
        isScActive ? +scSum(userWallet) < +amount : +userWallet.gcCoin < +amount
      ) {
        socketObj.insufficientBalance = true
        socketObj.coinType = isScActive ? 'scCoin' : 'gcCoin'
        InsufficientBalanceEmitter.insufficientBalance(socketObj, userId)
        throw INSUFFICIENT_BALANCE(apiversion)
      }

      if (!freeBonusId && isScActive) {
        let remainingBetAmount = 0
        const totalScCoin = +scSum(userWallet)
        if (+userWallet.scCoin.bsc >= amount) {
          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +minus(+userWallet.scCoin.bsc, amount).toFixed(2)
          }
          moreDetails.bsc = +amount // Entering the amount we cut from bsc
        } else {
          remainingBetAmount = +minus(amount, +userWallet.scCoin.bsc).toFixed(2)
          moreDetails.bsc = +userWallet.scCoin.bsc
          userWallet.scCoin = { ...userWallet.scCoin, bsc: 0 }
          if (+userWallet.scCoin.psc >= +remainingBetAmount) {
            userWallet.scCoin = {
              ...userWallet.scCoin,
              psc: +minus(+userWallet.scCoin.psc, remainingBetAmount).toFixed(2)
            }
            moreDetails.psc = +remainingBetAmount
          } else {
            remainingBetAmount = +minus(
              remainingBetAmount,
              +userWallet.scCoin.psc
            ).toFixed(2)
            moreDetails.psc = +userWallet.scCoin.psc
            userWallet.scCoin = { ...userWallet.scCoin, psc: 0 }
            if (+remainingBetAmount > +userWallet.scCoin.wsc) {
              await transaction.rollback()
              socketObj.insufficientBalance = true
              socketObj.coinType = isScActive ? 'scCoin' : 'gcCoin'
              InsufficientBalanceEmitter.insufficientBalance(socketObj, userId)
              throw INSUFFICIENT_BALANCE(apiversion)
            }
            userWallet.scCoin = {
              ...userWallet.scCoin,
              wsc: +minus(+userWallet.scCoin.wsc, remainingBetAmount).toFixed(2)
            }
            moreDetails.wsc = +remainingBetAmount
          }
        }

        beforeBalance = +totalScCoin.toFixed(2)
        afterBalance = +minus(totalScCoin, amount).toFixed(2)
        socketObj.scCoin = afterBalance
        socketObj.wsc = +userWallet.scCoin.wsc
      } else if (!freeBonusId && !isScActive) {
        beforeBalance = +userWallet.gcCoin
        afterBalance = +minus(+userWallet.gcCoin, +amount).toFixed(2)
        userWallet.gcCoin = +afterBalance
        socketObj.gcCoin = +afterBalance
      } else if (freeBonusId) {
        if (isScActive) {
          freeSpinTotalAmount = +scSum(userWallet)
          beforeBalance = +freeSpinTotalAmount
          afterBalance = +freeSpinTotalAmount
          socketObj.scCoin = +freeSpinTotalAmount
        } else {
          freeSpinTotalAmount = +userWallet.gcCoin
          beforeBalance = +freeSpinTotalAmount
          afterBalance = +freeSpinTotalAmount
          socketObj.gcCoin = +freeSpinTotalAmount
        }
      }

      await userWallet.save({ transaction })

      const transactionObj = {
        transactionId: transactionId + '',
        userId,
        actionType: freeBonusId ? ACTION.FREE_SPINS : ACTION.BET,
        actionId: ACTION_TYPE.DEBIT,
        amount: freeBonusId ? 0 : amount,
        gameId: +isGameExist.masterCasinoGameId,
        roundId: roundId + '',
        gc: isScActive ? 0 : +amount,
        sc: isScActive ? +amount : 0,
        walletId: userData.userWallet.walletId,
        currencyCode: userData.userWallet.currencyCode,
        beforeBalance: freeBonusId ? freeSpinTotalAmount : beforeBalance,
        afterBalance: freeBonusId ? freeSpinTotalAmount : afterBalance,
        amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        device: device ?? 'desktop',
        createdAt: new Date(),
        updatedAt: new Date(),
        gameIdentifier: identifier,
        status: TRANSACTION_STATUS.SUCCESS,
        roundStatus: false,
        moreDetails,
        tournamentId
      }

      const createTransaction = await CasinoTransactionModel.create(transactionObj, { transaction })

      WalletEmitter.emitUserWalletBalance(socketObj, userId)

      if (!tournamentId) updateUserTierDetail(userId, +amount, isScActive ? 'SC' : 'GC')

      // raffle helper call here
      if (isScActive && !tournamentId) raffleHelper(userId)

      return {
        code: 200,
        status: 'Success',
        accounttransactionid: createTransaction.casinoTransactionId,
        balance: +afterBalance,
        bonusmoneybet: 0,
        realmoneybet: +amount,
        bonus_balance: 0.0,
        real_balance: +afterBalance,
        game_mode: 1,
        apiversion
      }
    } catch (error) {
      await transaction.rollback()
      console.log(error)
      if (error.code) return error
      Logger.error('GSoft Bet Service Error', error)
      return TECHNICAL_ERROR(apiversion)
    }
  }
}
