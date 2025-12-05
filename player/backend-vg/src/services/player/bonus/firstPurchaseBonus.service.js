import { Op } from 'sequelize'
import { v4 as uuid } from 'uuid'
import { plus, round } from 'number-precision'
import ServiceBase from '../../serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import { ACTION_TYPE, BONUS_STATUS, BONUS_TYPE, TRANSACTION_STATUS, USER_ACTIVITIES_TYPE } from '../../../utils/constants/constant'
import { scSum } from '../../../utils/common'

export class ClaimFirstPurchaseBonus extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Bonus: BonusModel,
        Wallet: WalletModel,
        Package: PackageModel,
        UserBonus: UserBonusModel,
        UserActivities: UserActivitiesModel,
        CasinoTransaction: CasinoTransactionModel
      },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const { userId, packageId } = this.args

      const packageData = await PackageModel.findOne({
        where: {
          packageId: packageId,
          isActive: true,
          firstPurchaseApplicable: true,
          isVisibleInStore: true,
          [Op.or]: [
            { validTill: { [Op.gte]: new Date(Date.now()) } },
            { validTill: { [Op.is]: null } }
          ]
        },
        transaction
      })

      if (!packageData) {
        return {
          success: false,
          message: 'First Purchase bonus not active on this package.'
        }
      }

      // 1) check if first-purchase-bonus is active or not
      const isFirstPurchaseBonusExist = await BonusModel.findOne({
        where: {
          isActive: true,
          bonusType: BONUS_TYPE.FIRST_PURCHASE_BONUS
        },
        transaction
      })
      if (!isFirstPurchaseBonusExist) {
        return { success: false, message: 'FirstPurchaseBonusNotExistOrInactive' }
      }
      //  2) check if first purchase awarded
      const isFirstPurchaseBonusClaimed = await UserActivitiesModel.findOne({
        where: {
          userId: userId,
          activityType: USER_ACTIVITIES_TYPE.FIRST_PURCHASE_BONUS
        },
        transaction
      })

      if (isFirstPurchaseBonusClaimed) {
        return { success: false, message: 'FirstPurchaseBonusAlreadyClaimed' }
      }

      const userWallet = await WalletModel.findOne({
        where: { ownerId: userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      let balanceObj = {
        beforeScBalance: scSum(userWallet),
        beforeGcBalance: +round(+userWallet.gcCoin, 2)
      }

      userWallet.gcCoin = +round(+plus(packageData.firstPurchaseGcBonus, userWallet.gcCoin), 2)
      userWallet.scCoin = {
        ...userWallet.scCoin,
        bsc: +round(+plus(+packageData.firstPurchaseScBonus, +userWallet.scCoin.bsc), 2)
      }

      balanceObj = {
        ...balanceObj,
        afterScBalance: +scSum(userWallet),
        afterGcBalance: +round(+userWallet.gcCoin, 2)
      }

      const userBonusObj = {
        bonusId: isFirstPurchaseBonusExist.bonusId,
        userId: userId,
        bonusType: BONUS_TYPE.FIRST_PURCHASE_BONUS,
        status: BONUS_STATUS.CLAIMED,
        scAmount: packageData.firstPurchaseScBonus,
        gcAmount: packageData.firstPurchaseGcBonus,
        claimedAt: new Date()
      }
      const isCreated = await UserBonusModel.create(userBonusObj, { transaction })
      const transactionObj = {
        userId: userId,
        actionType: BONUS_TYPE.FIRST_PURCHASE_BONUS,
        actionId: ACTION_TYPE.CREDIT,
        status: TRANSACTION_STATUS.SUCCESS,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        userBonusId: isCreated.userBonusId,
        sc: packageData.firstPurchaseScBonus,
        gc: packageData.firstPurchaseGcBonus,
        moreDetails: balanceObj,
        roundId: 'NULL',
        transactionId: `${new Date(
          new Date().toString().split('GMT')[0] + ' UTC'
        ).toISOString()}-TRANSACTION`
      }

      await Promise.all([CasinoTransactionModel.create(transactionObj, { transaction }), UserActivitiesModel.create({ activityType: USER_ACTIVITIES_TYPE.FIRST_PURCHASE_BONUS, userId: userId, uniqueId: uuid() }, { transaction }), userWallet.save({ transaction })])

      WalletEmitter.emitUserWalletBalance({ scCoin: balanceObj.afterScBalance, gcCoin: balanceObj.afterGcBalance }, userId)

      return { success: true, message: SUCCESS_MSG.FIRST_PURCHASE_BONUS_CREATED }
    } catch (error) {
      await transaction.rollback()
      console.log('Error in Claim First Purchase Bonus Service', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
