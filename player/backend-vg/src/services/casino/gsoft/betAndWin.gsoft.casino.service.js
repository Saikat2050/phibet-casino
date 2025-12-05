import ServiceBase from '../../serviceBase'
import { plus, minus } from 'number-precision'
import { checkBetLimit } from '../../../utils/responsibleGambling'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import {
  ACTION,
  ACTION_TYPE,
  AMOUNT_TYPE,
  CASINO_TRANSACTION_STATUS,
  TRANSACTION_STATUS
} from '../../../utils/constants/constant'
import {
  BET_LIMIT_EXCEEDED,
  INSUFFICIENT_BALANCE,
  OPT_NOT_ALLOWED,
  ROUND_CLOSED,
  TECHNICAL_ERROR,
  scSum,
  userVerificationAndDetails
} from './helper.gsoft.casino'
import InsufficientBalanceEmitter from '../../../socket-resources/emitter/insufficientBalance.emitter'
import { tournamentHelper } from '../../../helpers/tournament.helper'
import { updateUserTierDetail } from '../../../helpers/tiers.helper'
import { raffleHelper } from '../../../helpers/raffle.helper'

export class BetAndWinGSoftCasinoService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Wallet: WalletModel,
        CasinoTransaction: CasinoTransactionModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const {
      accountid,
      apiversion,
      betamount,
      device,
      frbid: freeBonusId,
      gameid: identifier,
      gamesessionid,
      result: winAmount,
      roundid: roundId,
      transactionid: transactionId
    } = this.args

    let betBeforeBalance = 0
    let betAfterBalance = 0
    let winBeforeBalance = 0
    let winAfterBalance = 0
    let freeSpinTotalAmount = 0

    const socketObj = {}
    const moreDetails = {
      bsc: 0,
      psc: 0,
      wsc: 0
    }

    try {
      if (+betamount < 0) throw OPT_NOT_ALLOWED(apiversion)

      const {
        userData,
        isScActive,
        accountBalance,
        coin,
        userId,
        isGameExist,
        tournamentId
      } = await userVerificationAndDetails(
        {
          sessionId: gamesessionid,
          accountId: accountid,
          apiVersion: apiversion
        },
        transaction
      )

      if (+accountBalance < +betamount) {
        socketObj.insufficientBalance = true
        socketObj.coinType = isScActive ? 'scCoin' : 'gcCoin'
        InsufficientBalanceEmitter.insufficientBalance(socketObj, userId)
        throw INSUFFICIENT_BALANCE(apiversion)
      }

      if (coin === 'SC') {
        const limitCheck = await checkBetLimit({
          userId,
          betAmount: parseFloat(betamount)
        })
        if (limitCheck.limitReached) throw BET_LIMIT_EXCEEDED(apiversion)
      }

      const checkBetTransaction = await CasinoTransactionModel.findOne({
        where: {
          transactionId: `${transactionId}` + '',
          actionType: [ACTION.BET, ACTION.FREE_SPINS]
        },
        transaction
      })

      if (checkBetTransaction) {
        const getWinTransaction = await CasinoTransactionModel.findOne({
          where: {
            transactionId: transactionId + '',
            actionType: [ACTION.WIN, ACTION.LOST]
          }
        })

        return {
          code: 200,
          status: 'Success - duplicate request',
          walletTx: `${checkBetTransaction.casinoTransactionId}-WALLET_TRANSACTION`,
          balance: +accountBalance,
          bonusWin: 0,
          realMoneyWin: +getWinTransaction.amount,
          bonusmoneybet: 0,
          realmoneybet: +checkBetTransaction.amount,
          bonus_balance: 0.0,
          real_balance: +accountBalance,
          apiversion
        }
      }

      const userWallet = await WalletModel.findOne({
        where: { ownerId: userData.userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      const checkRound = await CasinoTransactionModel.findOne({
        where: { roundId: roundId + '', roundStatus: true },
        transaction
      })

      if (checkRound) throw ROUND_CLOSED(apiversion)

      await userWallet.reload({
        lock: {
          level: transaction.LOCK.UPDATE,
          of: WalletModel
        },
        transaction
      })

      //  Bet Calculation
      if (!freeBonusId && isScActive) {
        let remainingBetAmount = 0
        const totalScCoin = +scSum(userWallet)
        if (+userWallet.scCoin.bsc >= betamount) {
          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +minus(+userWallet.scCoin.bsc, betamount).toFixed(2)
          }
          moreDetails.bsc = +betamount // Entering the amount we cut from bsc
        } else {
          remainingBetAmount = +minus(
            betamount,
            +userWallet.scCoin.bsc
          ).toFixed(2)
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

        betBeforeBalance = +totalScCoin.toFixed(2)
        betAfterBalance = +minus(totalScCoin, betamount).toFixed(2)
      } else if (!freeBonusId && !isScActive) {
        betBeforeBalance = +userWallet.gcCoin
        betAfterBalance = +minus(+userWallet.gcCoin, +betamount).toFixed(2)
        userWallet.gcCoin = +betAfterBalance
      } else if (freeBonusId) {
        if (isScActive) {
          freeSpinTotalAmount = +scSum(userWallet)
          betBeforeBalance = +freeSpinTotalAmount
          betAfterBalance = +freeSpinTotalAmount
          socketObj.scCoin = +freeSpinTotalAmount
        } else {
          freeSpinTotalAmount = +userWallet.gcCoin
          betBeforeBalance = +freeSpinTotalAmount
          betAfterBalance = +freeSpinTotalAmount
          socketObj.gcCoin = +freeSpinTotalAmount
        }
      }

      //  Win Calculation
      const updatedBalance = isScActive
        ? +scSum(userWallet)
        : +userWallet.gcCoin

      if (isScActive) {
        winBeforeBalance = +updatedBalance
        winAfterBalance = +plus(+winBeforeBalance, +winAmount).toFixed(2)

        userWallet.scCoin = {
          ...userWallet.scCoin,
          wsc: +plus(+userWallet.scCoin.wsc, +winAmount).toFixed(2)
        }
        socketObj.scCoin = +winAfterBalance
        socketObj.wsc = +(+userWallet.scCoin.wsc)
      } else {
        winBeforeBalance = +updatedBalance
        winAfterBalance = +plus(+winBeforeBalance, +winAmount).toFixed(2)
        userWallet.gcCoin = +winAfterBalance
        socketObj.gcCoin = +winAfterBalance
      }

      await userWallet.save({ transaction })

      // Bet Transaction
      const betTransaction = {
        transactionId: transactionId + '',
        userId,
        actionType: freeBonusId ? ACTION.FREE_SPINS : ACTION.BET,
        actionId: ACTION_TYPE.DEBIT,
        amount: freeBonusId ? 0 : betamount,
        gc: isScActive ? 0 : +betamount,
        sc: isScActive ? +betamount : 0,
        gameId: +isGameExist.masterCasinoGameId,
        roundId: roundId + '',
        walletId: userData.userWallet.walletId,
        currencyCode: userData.userWallet.currencyCode,
        beforeBalance: freeBonusId ? freeSpinTotalAmount : betBeforeBalance,
        afterBalance: freeBonusId ? freeSpinTotalAmount : betAfterBalance,
        amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        device: device ?? 'desktop',
        createdAt: new Date(),
        updatedAt: new Date(),
        gameIdentifier: identifier,
        status: TRANSACTION_STATUS.SUCCESS,
        roundStatus: true,
        moreDetails: { ...moreDetails, isBetWinBet: true },
        tournamentId
      }

      // Win Transaction
      const winTransaction = {
        transactionId: transactionId + '',
        userId: userData.userId,
        amount: +winAmount,
        gc: isScActive ? 0 : +winAmount,
        sc: isScActive ? +winAmount : 0,
        gameId: +isGameExist.masterCasinoGameId,
        roundId: roundId,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        beforeBalance: winBeforeBalance,
        afterBalance: winAfterBalance,
        amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        device: device ?? 'desktop',
        gameIdentifier: identifier,
        roundStatus: true,
        status: CASINO_TRANSACTION_STATUS.COMPLETED,
        moreDetails,
        tournamentId
      }

      if (+winAmount === 0) {
        winTransaction.actionType = ACTION.LOST
        winTransaction.actionId = ACTION_TYPE.LOST
      } else {
        winTransaction.actionType = ACTION.WIN
        winTransaction.actionId = ACTION_TYPE.CREDIT
      }

      const bet = await CasinoTransactionModel.create(betTransaction, { transaction })
      await CasinoTransactionModel.create(winTransaction, { transaction })

      setTimeout(() => {
        WalletEmitter.emitUserWalletBalance(socketObj, userId) // Because Gsoft completes the transaction after success response.
      }, 2500)

      if (tournamentId) tournamentHelper(userId, tournamentId)

      if (!tournamentId) updateUserTierDetail(userId, +betamount, isScActive ? 'SC' : 'GC')

      // raffle helper call here
      if (isScActive && !tournamentId) raffleHelper(userId)

      return {
        code: 200,
        status: 'Success',
        walletTx: `${bet.casinoTransactionId}-WALLET_TRANSACTION`,
        balance: +winAfterBalance,
        bonusWin: 0,
        realMoneyWin: +winAmount,
        bonusmoneybet: 0,
        realmoneybet: +betamount,
        bonus_balance: 0.0,
        real_balance: +winAfterBalance,
        apiversion
      }
    } catch (error) {
      await transaction.rollback()
      console.log(error)
      if (error.code) return error
      return TECHNICAL_ERROR(apiversion)
    }
  }
}
