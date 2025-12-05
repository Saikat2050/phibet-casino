import ServiceBase from '../../serviceBase'
import { minus, plus, round } from 'number-precision'
import {
  ACTION,
  ACTION_TYPE,
  AMOUNT_TYPE,
  TRANSACTION_STATUS,
  CASINO_TRANSACTION_STATUS
} from '../../../utils/constants/constant'
import {
  userDetailsAndVerification,
  BAD_REQUEST,
  TRANSACTION_ALREADY_PROCESSED,
  BET_DENIED,
  INSUFFICIENT_BALANCE,
  INTERNAL_ERROR,
  TRANSACTION_NOT_FOUND,
  UNKNOWN_ERROR,
  BET_MAX,
  scSum
} from './beterLive.helper'

export class CancelTipsBeterLiveCasinoService extends ServiceBase {
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
      sessionToken,
      transactionId,
      amount,
      launchAlias: identifier
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

        const isTipPlaced = await CasinoTransactionModel.findOne({
            where: {
              transactionId: transactionId + '',
              actionType: ACTION.TIP,
              userId
            },
            transaction
          })
          if (!isTipPlaced) throw TRANSACTION_NOT_FOUND
          isTipPlaced.status = CASINO_TRANSACTION_STATUS.ROLLBACK
          await isTipPlaced.save()
    
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
          beforeBalance = +balance
          afterBalance = isTipPlaced.actionId === ACTION_TYPE.DEBIT ? +round(plus(beforeBalance, amount),2) : +beforeBalance
         
          if (isScActive) {
            userWallet.scCoin = {
              ...userWallet.scCoin,
              psc: isTipPlaced.actionId === ACTION_TYPE.DEBIT? +round(+plus(+userWallet.scCoin.psc, +amount),2) : +userWallet.scCoin.psc
            }
            socketObj.scCoin = +afterBalance
          } else {
            userWallet.gcCoin = +afterBalance
            socketObj.gcCoin = +afterBalance
          }
          await userWallet.save({ transaction })
    
          const transactionObj = {
            transactionId: transactionId + '',
            userId: userId,
            amount: +amount,
            gc: isScActive ? 0 : +amount,
            sc: isScActive ? +amount : 0,
            actionType: ACTION.ROLLBACK,
            actionId: ACTION_TYPE.CREDIT,
            gameId: +isTipPlaced.gameId,
            roundId: 'NULL',
            walletId: userWallet.walletId,
            currencyCode: userWallet.currencyCode,
            beforeBalance: beforeBalance,
            afterBalance: afterBalance,
            amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
            device: device ?? 'desktop',
            gameIdentifier: identifier,
            status: CASINO_TRANSACTION_STATUS.COMPLETED,
            moreDetails,
          }
    
          const newTransaction = await CasinoTransactionModel.create(
            transactionObj,
            { transaction }
          )
        return { balance: afterBalance+'' }
    } catch (error) {
      console.log('error:', error)
      await transaction.rollback()
      if (error.status) throw error
      throw INTERNAL_ERROR
    }
  }
}
