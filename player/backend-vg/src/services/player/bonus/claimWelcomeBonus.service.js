import moment from 'moment/moment'
import ServiceBase from '../../serviceBase'
import { plus, round } from 'number-precision'
import { UserActivityService } from '../userActivity.service'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import { ACTION_TYPE, AMOUNT_TYPE, BONUS_STATUS, BONUS_TYPE, TRANSACTION_STATUS, USER_ACTIVITIES_TYPE } from '../../../utils/constants/constant'
import { Op } from 'sequelize'
export class ClaimWelcomeBonusService extends ServiceBase {
  async run () {
    const {
      Wallet: WalletModel,
      Bonus: BonusModel,
      User: UserModel,
      UserBonus: UserBonusModel,
      CasinoTransaction: CasinoTransactionModel,
      UserActivities: UserActivitiesModel
    } = this.context.dbModels

    const { detail } = this.context.req.user
    const transaction = this.context.sequelizeTransaction
    const { needWelcomeBonus } = this.args

    try {
      if (needWelcomeBonus === 'false') {
        await UserModel.update({
          moreDetails: { ...detail.moreDetails, notNeedWelcomeBonus: true }
        }, {
          where: { userId: detail.userId },
          transaction
        })
        return { success: true, message: SUCCESS_MSG.WELCOME_BONUS_DECLINED }
      }
      const userWallet = await WalletModel.findOne({
        where: { ownerId: detail.userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      const isBonusClaimed = await UserActivitiesModel.findOne({
        where: {
          userId: detail.userId,
          activityType: USER_ACTIVITIES_TYPE.WELCOME_BONUS_CLAIMED
        },
        transaction
      })

      if (isBonusClaimed) {
        return this.addError('BonusClaimedErrorType', '')
      }

      const bonusData = await BonusModel.findOne({
        where: {
          isActive: true,
          bonusType: BONUS_TYPE.WELCOME_BONUS,
          lastActivatedTime: { [Op.lt]: new Date(detail.createdAt) }
        },
        transaction
      })

      if (bonusData?.validFrom <= moment(new Date()).format('YYYY-MM-DD')) {
        return this.addError('WelcomeBonusNotFoundErrorType', '')
      }

      let balanceObj = {
        beforeScBalance: ((userWallet.scCoin.bsc || 0) + (userWallet.scCoin.psc || 0) + (userWallet.scCoin.wsc || 0)),
        beforeGcBalance: userWallet.gcCoin
      }

      userWallet.gcCoin = +((+userWallet.gcCoin + +bonusData.gcAmount).toFixed(2))
      userWallet.scCoin = { ...userWallet.scCoin, bsc: +((+userWallet.scCoin.bsc + +bonusData?.scAmount).toFixed(2)) }

      const socketObj = {
        gcCoin: +round(+userWallet.gcCoin, 2),
        scCoin: +round(+plus(+userWallet.scCoin.bsc, +userWallet.scCoin.wsc, +userWallet.scCoin.psc), 2)
      }

      balanceObj = {
        ...balanceObj,
        afterScBalance: socketObj.scCoin,
        afterGcBalance: socketObj.gcCoin
      }

      const userBonusObj = {
        bonusId: bonusData.bonusId,
        userId: detail.userId,
        bonusType: BONUS_TYPE.WELCOME_BONUS,
        sc: bonusData.scAmount,
        gc: bonusData.gcAmount,
        claimedAt: new Date(),
        status: BONUS_STATUS.CLAIMED
      }

      const isCreated = await UserBonusModel.create(userBonusObj, { transaction })

      const transactionObj = {
        userId: detail.userId,
        actionType: BONUS_TYPE.WELCOME_BONUS,
        actionId: ACTION_TYPE.CREDIT,
        status: TRANSACTION_STATUS.SUCCESS,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        userBonusId: isCreated.userBonusId,
        sc: bonusData.scAmount,
        gc: bonusData.gcAmount,
        amountType: AMOUNT_TYPE.SC_GC_COIN,
        moreDetails: balanceObj,
        roundId: 'NULL',
        transactionId: `${new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString()}-TRANSACTION`
      }

      await CasinoTransactionModel.create(transactionObj, { transaction })

      await UserActivityService.execute({ activityType: USER_ACTIVITIES_TYPE.WELCOME_BONUS_CLAIMED, userId: detail.userId }, this.context)

      await userWallet.save({ transaction })

      await transaction.commit()

      WalletEmitter.emitUserWalletBalance(socketObj, detail.userId)

      return { success: true, message: SUCCESS_MSG.AVAIL_BONUS, userWallet }
    } catch (error) {
      const transactionStatuses = ['commit', 'rollback']
      if (!(~transactionStatuses.indexOf(transaction.finished))) { await transaction.rollback() }
      console.log('Error in claim welcome bonus service', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
