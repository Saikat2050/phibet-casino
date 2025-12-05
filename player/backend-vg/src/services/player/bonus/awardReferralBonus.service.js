import { v4 as uuid } from 'uuid'
import sequelize, { Op } from 'sequelize'
import ServiceBase from '../../serviceBase'
import { scSum } from '../../../utils/common'
import { plus, round } from 'number-precision'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import { ACTION_TYPE, AMOUNT_TYPE, BONUS_STATUS, BONUS_TYPE, TRANSACTION_STATUS, TRANSACTION_TYPE, USER_ACTIVITIES_TYPE } from '../../../utils/constants/constant'

export class AwardReferralBonusService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        Bonus: BonusModel,
        Wallet: WalletModel,
        UserBonus: UserBonusModel,
        UserActivities: UserActivitiesModel,
        CasinoTransaction: CasinoTransactionModel,
        TransactionBanking: TransactionBankingModel
      },
      sequelizeTransaction
    } = this.context

    const { userId } = this.args

    try {
      const userDetails = await UserModel.findOne({
        attributes: ['userId', 'referredBy'],
        where: {
          userId
        },
        transaction: sequelizeTransaction
      })

      if (!userDetails.referredBy) {
        return { success: false, message: 'UserIsNotReferredUser' }
      }

      const isBonusExist = await BonusModel.findAll({
        where: {
          isActive: true,
          bonusType: BONUS_TYPE.REFERRAL_BONUS,
          minimumPurchase: { [Op.ne]: null }
        },
        order: [['minimumPurchase', 'ASC']],
        raw: true,
        transaction: sequelizeTransaction
      })

      if (!isBonusExist) {
        return { success: false, message: 'ReferralBonusNotFound' }
      }

      const userTotalPurchase = await TransactionBankingModel.findOne({
        where: {
          actioneeId: userDetails.userId,
          transactionType: TRANSACTION_TYPE.DEPOSIT,
          status: TRANSACTION_STATUS.SUCCESS
        },
        attributes: [
          [
            sequelize.fn('SUM', sequelize.col('amount')),
            'totalPurchaseAmount'
          ]
        ],
        raw: true,
        transaction: sequelizeTransaction
      })

      const referringUserWallet = await WalletModel.findOne({
        where: {
          ownerId: userDetails.referredBy
        },
        lock: { level: sequelizeTransaction.LOCK.UPDATE, of: WalletModel },
        transaction: sequelizeTransaction
      })
      const casinoTransaction = []
      const userActivity = []
      for (const bonusData of isBonusExist) {
        if (+userTotalPurchase.totalPurchaseAmount < +bonusData.minimumPurchase) continue

        const isBonusClaimed = await UserActivitiesModel.findOne({
          where: {
            userId: referringUserWallet.ownerId,
            activityType: USER_ACTIVITIES_TYPE.REFERRAL_BONUS_CLAIMED,
            referredUser: userDetails.userId,
            bonusId: bonusData.bonusId
          },
          transaction: sequelizeTransaction
        })

        if (isBonusClaimed) continue

        const balanceObj = {
          beforeScBalance: +round(+plus(+referringUserWallet.scCoin.bsc, +referringUserWallet.scCoin.psc, +referringUserWallet.scCoin.wsc), 2),
          beforeGcBalance: +round((+referringUserWallet.gcCoin), 2),
          afterScBalance: +round(+plus(+referringUserWallet.scCoin.bsc, +referringUserWallet.scCoin.psc, +referringUserWallet.scCoin.wsc, +bonusData.scAmount), 2),
          afterGcBalance: +round(+plus(+referringUserWallet.gcCoin, +bonusData.gcAmount), 2)
        }

        referringUserWallet.gcCoin = +round(+plus(referringUserWallet.gcCoin, +bonusData.gcAmount), 2)
        referringUserWallet.scCoin = {
          ...referringUserWallet.scCoin,
          bsc: +round(+plus(+referringUserWallet.scCoin.bsc, +bonusData.scAmount), 2)
        }

        const isCreated = await UserBonusModel.create(
          {
            bonusId: bonusData.bonusId,
            userId: referringUserWallet.ownerId,
            bonusType: BONUS_TYPE.REFERRAL_BONUS,
            scAmount: bonusData.scAmount,
            gcAmount: bonusData.gcAmount,
            claimedAt: new Date(),
            status: BONUS_STATUS.CLAIMED
          },
          { transaction: sequelizeTransaction }
        )

        casinoTransaction.push({
          userId: +referringUserWallet.ownerId,
          actionType: BONUS_TYPE.REFERRAL_BONUS,
          actionId: ACTION_TYPE.CREDIT,
          status: TRANSACTION_STATUS.SUCCESS,
          walletId: +referringUserWallet.walletId,
          currencyCode: referringUserWallet.currencyCode,
          userBonusId: isCreated.userBonusId,
          sc: bonusData.scAmount,
          gc: bonusData.gcAmount,
          amountType: AMOUNT_TYPE.SC_GC_COIN,
          moreDetails: balanceObj,
          roundId: 'NULL',
          transactionId: `${new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString()}-TRANSACTION`
        })

        userActivity.push({
          activityType: USER_ACTIVITIES_TYPE.REFERRAL_BONUS_CLAIMED,
          userId: +referringUserWallet.ownerId,
          referredUser: userDetails.userId,
          bonusId: bonusData.bonusId,
          uniqueId: uuid()
        })
      }
      const socketObj = { scCoin: scSum(referringUserWallet), gcCoin: +round(+referringUserWallet.gcCoin, 2) }

      await Promise.all([
        referringUserWallet.save({ transaction: sequelizeTransaction }),
        UserActivitiesModel.bulkCreate(userActivity, { transaction: sequelizeTransaction }),
        CasinoTransactionModel.bulkCreate(casinoTransaction, { transaction: sequelizeTransaction })
      ])

      WalletEmitter.emitUserWalletBalance(socketObj, +referringUserWallet.ownerId)

      return { success: true, message: SUCCESS_MSG.AVAIL_BONUS }
    } catch (error) {
      console.log('Error in Referral Bonus -', error)
      return 'InternalServerErrorType'
    }
  }
}
