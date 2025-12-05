import ServiceBase from '../../serviceBase'
import { plus, round } from 'number-precision'
import {
  ACTION_TYPE,
  AMOUNT_TYPE,
  BONUS_STATUS,
  BONUS_TYPE,
  TRANSACTION_STATUS
} from '../../../utils/constants/constant'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'

export class ClaimPersonalBonusService extends ServiceBase {
  async run () {
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

    const userId = detail.userId
    let socketObj = {}

    const { bonusCode } = this.args

    const bonusDetails = await PersonalBonusModel.findOne({
      where: {
        bonusCode
      }
    })

    if (!bonusDetails) return this.addError('InvalidBonusCodeErrorType')

    if (+bonusDetails.createdBy === +userId) { return this.addError('PersonalBonusNotClaimedByCreateUser') }

    if (bonusDetails?.status === BONUS_STATUS.CLAIMED) { return this.addError('PersonalBonusAlreadyClaimedErrorType') }

    const userWallet = await WalletModel.findOne({
      where: { ownerId: userId },
      lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
      transaction
    })

    const isScBonus = bonusDetails.coinType === 'SC'

    let balanceObj = {
      beforeScBalance: +round(+plus(+userWallet.scCoin.bsc, +userWallet.scCoin.wsc, +userWallet.scCoin.psc), 2),
      beforeGcBalance: +round(+userWallet.gcCoin, 2)
    }

    if (isScBonus) {
      userWallet.scCoin = {
        ...userWallet.scCoin,
        bsc: +round(+plus(+userWallet.scCoin.bsc, +bonusDetails.amount), 2)
      },
      socketObj = {
        ...socketObj,
        scCoin: +round(+plus(+userWallet.scCoin.bsc, +userWallet.scCoin.wsc, +userWallet.scCoin.psc), 2),
        bsc: +round(+userWallet.scCoin.bsc, 2)
      }
    } else {
      userWallet.gcCoin = +round(+plus(userWallet.gcCoin, +bonusDetails.amount), 2)
      socketObj = {
        ...socketObj,
        gcCoin: userWallet.gcCoin
      }
    }

    balanceObj = {
      ...balanceObj,
      afterScBalance: +round(+plus(+userWallet.scCoin.bsc, +userWallet.scCoin.wsc, +userWallet.scCoin.psc), 2),
      afterGcBalance: +round(+userWallet.gcCoin, 2)
    }

    await userWallet.save({ transaction })

    const transactionObj = {
      userId,
      transactionId: `${new Date(
        new Date().toString().split('GMT')[0] + ' UTC'
      ).toISOString()}-TRANSACTION`,
      actionType: BONUS_TYPE.PERSONAL_BONUS,
      actionId: ACTION_TYPE.CREDIT,
      status: TRANSACTION_STATUS.SUCCESS,
      walletId: detail.userWallet.walletId,
      currencyCode: detail.userWallet.currencyCode,
      roundId: 'NULL',
      amount: bonusDetails.amount,
      amountType: isScBonus ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
      sc: bonusDetails.coinType === 'GC' ? 0 : +bonusDetails.amount,
      gc: bonusDetails.coinType === 'GC' ? +bonusDetails.amount : 0,
      moreDetails: balanceObj,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await CasinoTransactionModel.create(transactionObj, { transaction })

    await PersonalBonusModel.update(
      {
        status: BONUS_STATUS.CLAIMED,
        claimedBy: userId,
        claimedAt: new Date()
      },
      { where: { bonusCode }, transaction }
    )

    WalletEmitter.emitUserWalletBalance(socketObj, userId)

    return { message: 'Bonus Claimed Successfully' }
  }
}
