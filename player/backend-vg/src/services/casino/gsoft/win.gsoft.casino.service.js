import { Op } from 'sequelize'
import { plus } from 'number-precision'
import ServiceBase from '../../serviceBase'
import { tournamentHelper } from '../../../helpers/tournament.helper'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import { ACTION, ACTION_TYPE, AMOUNT_TYPE, CASINO_TRANSACTION_STATUS } from '../../../utils/constants/constant'
import { AUTH_FAILED, BET_NOT_FOUND, OPT_NOT_ALLOWED, ROUND_CLOSED, TECHNICAL_ERROR, TRANSACTION_PARAMETER_MISMATCH, scSum } from './helper.gsoft.casino'

export class WinGSoftCasinoService extends ServiceBase {
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

    let beforeBalance = 0
    let afterBalance = 0
    const socketObj = {}
    let moreDetails = {
      bsc: 0,
      psc: 0,
      wsc: 0
    }

    const {
      accountid: accountId,
      apiversion,
      device,
      frbid: freeRoundId,
      gameid: identifier,
      gamestatus: gameStatus,
      result: amount,
      roundid: roundId,
      transactionid: transactionId
    } = this.args

    try {
      if (+amount < 0) throw OPT_NOT_ALLOWED(apiversion)

      const [userId, coin] = accountId.split('_')
      const isScActive = coin === 'SC'

      const gameData = await MasterCasinoGameModel.findOne({
        attributes: ['identifier', 'name', 'masterCasinoGameId'],
        where: {
          identifier: identifier + ''
        },
        transaction
      })

      if (!gameData) throw OPT_NOT_ALLOWED(apiversion)

      const userData = await UserModel.findOne({
        attributes: ['userId', 'isActive', 'city'],
        where: {
          userId,
          isActive: true
        },
        include: [
          {
            model: WalletModel,
            as: 'userWallet',
            attributes: [
              'walletId',
              'amount',
              'currencyCode',
              'ownerId',
              'gcCoin',
              'scCoin'
            ]
          }
        ],
        transaction
      })

      if (!userData) throw AUTH_FAILED(apiversion)

      const checkTransaction = await CasinoTransactionModel.findOne({
        where: {
          transactionId: transactionId + ''
        },
        transaction
      })

      if (checkTransaction) {
        if (
          accountId ===
            `${checkTransaction.userId}_${
              checkTransaction.amountType === 1 ? 'SC' : 'GC'
            }` &&
          +amount === +checkTransaction.amount
        ) {
          return {
            code: 200,
            apiversion,
            status: 'Success - duplicate request',
            balance: isScActive
              ? +scSum(userData.userWallet)
              : +userData.userWallet.gcCoin,
            bonusWin: 0,
            game_mode: 1,
            realMoneyWin: checkTransaction.amount,
            bonusMoneyWin: 0,
            realBalance: isScActive
              ? +scSum(userData.userWallet)
              : +userData.userWallet.gcCoin,
            bonusBalance: 0,
            walletTx: `${checkTransaction.casinoTransactionId}-WALLET_TRANSACTION`
          }
        } else {
          throw TRANSACTION_PARAMETER_MISMATCH(apiversion)
        }
      }

      const checkRound = await CasinoTransactionModel.findOne({
        where: { roundId: roundId + '', roundStatus: true },
        transaction
      })

      if (checkRound) throw ROUND_CLOSED(apiversion)

      const isBetPlaced = await CasinoTransactionModel.findOne({
        where: {
          userId,
          roundId: roundId + '',
          actionType: {
            [Op.in]: [ACTION.BET, ACTION.FREE_SPINS]
          }
        }
      })

      if (!freeRoundId && !isBetPlaced) throw BET_NOT_FOUND(apiversion)

      if (!freeRoundId) isBetPlaced.status = CASINO_TRANSACTION_STATUS.COMPLETED

      if (!freeRoundId) await isBetPlaced.save()

      moreDetails = { ...moreDetails, freeRoundId }

      const userWallet = await WalletModel.findOne({
        where: { ownerId: userData.userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      const balance = isScActive ? +scSum(userWallet) : +userWallet.gcCoin

      if (isScActive) {
        beforeBalance = +balance
        afterBalance = +plus(+beforeBalance, +amount).toFixed(2)
        userWallet.scCoin = {
          ...userWallet.scCoin,
          wsc: +plus(+userWallet.scCoin.wsc, +amount).toFixed(2)
        }
        socketObj.scCoin = +afterBalance
        socketObj.wsc = +userWallet.scCoin.wsc
      } else {
        beforeBalance = +balance
        afterBalance = +plus(+balance, +amount).toFixed(2)
        userWallet.gcCoin = +afterBalance
        socketObj.gcCoin = +afterBalance
      }

      await userWallet.save({ transaction })

      const transactionObj = {
        transactionId: transactionId + '',
        userId: userData.userId,
        amount: +amount,
        gameId: +gameData.masterCasinoGameId,
        roundId: roundId,
        gc: isScActive ? 0 : +amount,
        sc: isScActive ? +amount : 0,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        beforeBalance: beforeBalance,
        afterBalance: afterBalance,
        amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        device: device ?? 'desktop',
        gameIdentifier: identifier,
        roundStatus: gameStatus === 'completed',
        status: CASINO_TRANSACTION_STATUS.COMPLETED,
        moreDetails,
        tournamentId: isBetPlaced?.tournamentId
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

      if (gameStatus === 'completed') {
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

      setTimeout(() => {
        WalletEmitter.emitUserWalletBalance(socketObj, userId) // Because Gsoft completes the transaction after success response.
      }, 1500)

      if (isBetPlaced?.tournamentId) tournamentHelper(userData.userId, +isBetPlaced?.tournamentId)

      return {
        code: 200,
        apiversion,
        balance: +afterBalance,
        bonusWin: 0,
        game_mode: 1,
        realMoneyWin: +amount,
        bonusMoneyWin: 0,
        realBalance: +afterBalance,
        bonusBalance: 0.0,
        status: 'Success',
        walletTx: `${winTransaction.casinoTransactionId}-WALLET_TRANSACTION`
      }
    } catch (error) {
      await transaction.rollback()
      console.log(error)
      if (error.code) return error
      return TECHNICAL_ERROR(apiversion)
    }
  }
}
