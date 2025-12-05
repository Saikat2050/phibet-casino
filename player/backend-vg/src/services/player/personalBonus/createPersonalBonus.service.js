import ServiceBase from '../../serviceBase'
import { minus, plus } from 'number-precision'
import { generatePersonalBonusCode } from '../../../utils/common'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import {
  ACTION_TYPE,
  AMOUNT_TYPE,
  BONUS_STATUS,
  BONUS_TYPE,
  TRANSACTION_STATUS
} from '../../../utils/constants/constant'

export class CreatePersonalBonusService extends ServiceBase {
  async run () {
    try {
      const {
        req: {
          user: { detail }
        },
        dbModels: {
          Wallet: WalletModel,
          PersonalBonus: PersonalBonusModel,
          CasinoTransaction: CasinoTransactionModel
        },
        sequelizeTransaction: transaction
      } = this.context

      let { coinType, amount } = this.args

      const userId = detail.userId

      coinType = coinType?.toUpperCase()
      const applyAmt = amount

      const bonusCode = await generatePersonalBonusCode()

      const userWallet = await WalletModel.findOne({
        where: { ownerId: userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      const userBalance =
        coinType === 'SC' ? userWallet.scCoin.bsc : userWallet.gcCoin

      if (amount > +userBalance) {
        return this.addError('InsufficientBalanceErrorType')
      }

      let bonusGcCoin = 0
      let bonusScCoin = 0

      if (coinType === 'SC') {
        bonusScCoin = amount
      } else {
        bonusGcCoin = amount
      }

      await WalletModel.update(
        {
          gcCoin: +minus(userWallet.gcCoin, bonusGcCoin).toFixed(2),
          scCoin: {
            ...userWallet.scCoin,
            bsc: +minus(userWallet.scCoin.bsc, bonusScCoin).toFixed(2)
          }
        },
        {
          where: {
            ownerId: userId
          },
          transaction
        }
      )

      const beforeScBalance = +plus(
        +userWallet.scCoin.bsc,
        +userWallet.scCoin.psc,
        +userWallet.scCoin.wsc
      ).toFixed(2)

      const balanceObj = {
        beforeScBalance: beforeScBalance,
        beforeGcBalance: userWallet.gcCoin,
        afterScBalance:
          coinType === 'SC'
            ? +minus(+beforeScBalance, +amount).toFixed(2)
            : +beforeScBalance,
        afterGcBalance:
          coinType === 'GC'
            ? +minus(+userWallet.gcCoin, +amount).toFixed(2)
            : +userWallet.gcCoin
      }

      const amtType =
        coinType === 'GC' ? AMOUNT_TYPE.GC_COIN : AMOUNT_TYPE.SC_COIN

      const transactionObj = {
        userId,
        transactionId: `${new Date(
          new Date().toString().split('GMT')[0] + ' UTC'
        ).toISOString()}-TRANSACTION`,
        actionType: BONUS_TYPE.PERSONAL_BONUS,
        actionId: ACTION_TYPE.DEBIT,
        status: TRANSACTION_STATUS.SUCCESS,
        walletId: detail.userWallet.walletId,
        roundId: 'NULL',
        currencyCode: detail.userWallet.currencyCode,
        beforeBalance: parseFloat(userBalance),
        afterBalance: parseFloat(userBalance - amount),
        amount: applyAmt,
        amountType: amtType,
        sc: coinType === 'GC' ? 0 : +applyAmt,
        gc: coinType === 'GC' ? +applyAmt : 0,
        moreDetails: balanceObj,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await CasinoTransactionModel.create(transactionObj, { transaction })

      const createBonus = await PersonalBonusModel.create(
        {
          bonusCode,
          amount,
          coinType,
          createdBy: userId,
          status: BONUS_STATUS.ACTIVE
        },
        { transaction, raw: true }
      )

      WalletEmitter.emitUserWalletBalance(
        {
          scCoin: +balanceObj.afterScBalance,
          gcCoin: +balanceObj.afterGcBalance,
          bsc: +minus(userWallet.scCoin.bsc, bonusScCoin).toFixed(2)
        },
        userId
      )

      return {
        data: { ...createBonus.dataValues },
        message: 'Personal Bonus is created successfully'
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
