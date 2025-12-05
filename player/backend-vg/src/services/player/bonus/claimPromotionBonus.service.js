import ServiceBase from '../../serviceBase'
import { plus, round } from 'number-precision'
import { UserActivityService } from '../userActivity.service'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import { ACTION_TYPE, AMOUNT_TYPE, BONUS_STATUS, BONUS_TYPE, TRANSACTION_STATUS, USER_ACTIVITIES_TYPE } from '../../../utils/constants/constant'

export class ClaimPromotionBonusService extends ServiceBase {
  async run () {
    try {
      const {
        req: { user: { detail } },
        dbModels: {
          Bonus: BonusModel,
          Wallet: WalletModel,
          UserBonus: UserBonusModel,
          UserActivities: UserActivitiesModel,
          CasinoTransaction: CasinoTransactionModel
        },
        sequelizeTransaction: transaction
      } = this.context

      const userWallet = await WalletModel.findOne({
        where: { ownerId: detail.userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      const bonusData = await BonusModel.findOne({
        where: { isActive: true, bonusType: BONUS_TYPE.AFFILIATE_BONUS }
      })

      if (!bonusData) return this.addError('BonusNotFoundErrorType')

      const isBonusClaimed = await UserActivitiesModel.findOne({
        where: {
          userId: detail.userId,
          activityType: USER_ACTIVITIES_TYPE.AFFILIATE_BONUS_CLAIMED
        }
      })

      if (isBonusClaimed) {
        return this.addError('BonusClaimedErrorType', '')
      }

      const userBonus = await UserBonusModel.findOne({
        where: {
          userId: detail.userId,
          status: BONUS_STATUS.PENDING,
          bonusType: BONUS_TYPE.AFFILIATE_BONUS
        },
        lock: { level: transaction.LOCK.UPDATE, of: UserBonusModel },
        transaction
      })

      if (!userBonus) return this.addError('PromocodeDoesNotExistForThisUserErrorType')

      let balanceObj = {
        beforeScBalance: ((userWallet.scCoin.bsc || 0) + (userWallet.scCoin.psc || 0) + (userWallet.scCoin.wsc || 0)),
        beforeGcBalance: userWallet.gcCoin
      }

      userWallet.gcCoin = +((+userWallet.gcCoin + +userBonus.gcAmount).toFixed(2))
      userWallet.scCoin = { ...userWallet.scCoin, bsc: +((+userWallet.scCoin.bsc + +userBonus?.scAmount).toFixed(2)) }

      const socketObj = {
        gcCoin: +round(+userWallet.gcCoin, 2),
        scCoin: +round(+plus(+userWallet.scCoin.bsc, +userWallet.scCoin.wsc, +userWallet.scCoin.psc), 2)
      }

      balanceObj = {
        ...balanceObj,
        afterScBalance: ((+userWallet.scCoin.bsc || 0) + (userWallet.scCoin.psc || 0) + (userWallet.scCoin.wsc || 0)),
        afterGcBalance: +((+userWallet.gcCoin || 0).toFixed(2))
      }

      const transactionObj = {
        userId: detail.userId,
        actionType: BONUS_TYPE.AFFILIATE_BONUS,
        actionId: ACTION_TYPE.CREDIT,
        status: TRANSACTION_STATUS.SUCCESS,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        userBonusId: userBonus.userBonusId,
        sc: +userBonus.scAmount,
        gc: +userBonus.gcAmount,
        amountType: AMOUNT_TYPE.SC_GC_COIN,
        moreDetails: balanceObj,
        roundId: 'NULL',
        transactionId: `${new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString()}-TRANSACTION`
      }

      userBonus.status = BONUS_STATUS.CLAIMED
      userBonus.claimedAt = new Date()

      await Promise.all([
        (userBonus.save({ transaction })),
        (CasinoTransactionModel.create(transactionObj, { transaction })),
        (UserActivityService.execute({ activityType: USER_ACTIVITIES_TYPE.AFFILIATE_BONUS_CLAIMED, userId: detail.userId }, this.context)),
        (userWallet.save({ transaction }))
      ])

      await transaction.commit()

      WalletEmitter.emitUserWalletBalance(socketObj, detail.userId)

      return { success: true, message: SUCCESS_MSG.AVAIL_BONUS, userWallet }
    } catch (error) {
      console.log('Error in Claim Promotion Bonus Service', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
