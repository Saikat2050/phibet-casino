import { Op } from 'sequelize'
import { plus } from 'number-precision'
import ServiceBase from '../../serviceBase'
import { ACTION, ACTION_TYPE, AMOUNT_TYPE, TRANSACTION_STATUS } from '../../../utils/constants/constant'
import { AUTH_FAILED, BET_NOT_FOUND, ROUND_CLOSED, TECHNICAL_ERROR, TRANSACTION_PARAMETER_MISMATCH, scSum } from './helper.gsoft.casino'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
export class RollbackGSoftCasinoService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        Wallet: WalletModel,
        CasinoTransaction: CasinoTransactionModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const {
      accountid,
      apiversion,
      device,
      transactionid: transactionId
    } = this.args

    let beforeBalance = 0
    let afterBalance = 0
    const moreDetails = { wsc: 0, psc: 0, bsc: 0 }
    let socketObj

    try {
      const [userId, coin] = accountid.split('_')

      const checkTransaction = await CasinoTransactionModel.findOne({
        where: {
          transactionId: transactionId + '',
          actionType: {
            [Op.in]: [ACTION.BET, ACTION.FREE_SPINS]
          }
        },
        transaction
      })

      if (!checkTransaction) throw BET_NOT_FOUND(apiversion)

      if (
        +checkTransaction.userId !== +userId ||
        +checkTransaction.amountType !== AMOUNT_TYPE[`${coin}_COIN`]
      ) {
        throw TRANSACTION_PARAMETER_MISMATCH(apiversion)
      }

      const isScActive = coin === 'SC'

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

      if (checkTransaction.roundStatus) throw ROUND_CLOSED(apiversion)

      if (+checkTransaction.status === +TRANSACTION_STATUS.ROLLBACK) {
        const rollbackTransaction = await await CasinoTransactionModel.findOne({
          where: {
            transactionId: transactionId + '-Rollback'
          },
          transaction
        })

        return {
          code: 200,
          status: 'Success - duplicate request',
          accounttransactionid: rollbackTransaction.casinoTransactionId,
          balance: isScActive
            ? +scSum(userData.userWallet)
            : +userData.userWallet.gcCoin,
          bonus_balance: 0,
          real_balance: +checkTransaction.amount,
          game_mode: 1,
          apiversion
        }
      } else if (+checkTransaction.status === +TRANSACTION_STATUS.SUCCESS) {
        checkTransaction.status = TRANSACTION_STATUS.ROLLBACK
        await checkTransaction.save({ transaction })

        const userWallet = await WalletModel.findOne({
          where: { ownerId: userData.userId },
          lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
          transaction
        })

        await userWallet.reload({
          lock: {
            level: transaction.LOCK.UPDATE,
            of: WalletModel
          },
          transaction
        })

        const balance = isScActive ? +scSum(userWallet) : +userWallet.gcCoin

        if (isScActive) {
          beforeBalance = +balance
          afterBalance = +plus(
            +beforeBalance,
            +checkTransaction.amount
          ).toFixed(2)
          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +plus(
              +userWallet.scCoin.bsc,
              +checkTransaction.amount
            ).toFixed(2)
          }
          socketObj = {
            ...socketObj,
            scCoin: +afterBalance,
            wsc: +userWallet.scCoin.wsc
          }
        } else {
          beforeBalance = +balance
          afterBalance = +plus(+balance, +checkTransaction.amount).toFixed(2)
          userWallet.gcCoin = +afterBalance
          socketObj = {
            ...socketObj,
            gcCoin: +afterBalance
          }
        }

        await userWallet.save({ transaction })

        const transactionObj = {
          transactionId: transactionId + '-Rollback',
          userId: userData.userId,
          amount: +checkTransaction.amount,
          actionType: ACTION.ROLLBACK,
          actionId: ACTION_TYPE.CREDIT,
          gc: isScActive ? 0 : +checkTransaction.amount,
          sc: isScActive ? +checkTransaction.amount : 0,
          gameId: +checkTransaction.gameId,
          roundId: checkTransaction.roundId + '',
          walletId: userWallet.walletId,
          currencyCode: userWallet.currencyCode,
          beforeBalance: beforeBalance,
          afterBalance: afterBalance,
          amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
          device: device ?? 'desktop',
          gameIdentifier: +checkTransaction.identifier,
          status: TRANSACTION_STATUS.SUCCESS,
          moreDetails,
          tournamentId: +checkTransaction.tournamentId
        }

        const newTransaction = await CasinoTransactionModel.create(
          transactionObj,
          { transaction }
        )

        WalletEmitter.emitUserWalletBalance(socketObj, userId)

        return {
          accounttransactionid: newTransaction.casinoTransactionId,
          apiversion,
          balance: +afterBalance,
          code: 200,
          real_balance: +afterBalance,
          bonus_balance: 0.0,
          status: 'Success',
          walletTx: `${newTransaction.casinoTransactionId}-WALLET_TRANSACTION`
        }
      }
    } catch (error) {
      await transaction.rollback()
      console.log(error)
      if (error.code) return error
      return TECHNICAL_ERROR(apiversion)
    }
  }
}
