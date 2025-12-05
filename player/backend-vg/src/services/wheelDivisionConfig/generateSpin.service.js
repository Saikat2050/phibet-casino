import ServiceBase from '../serviceBase'
import { generateSpinWheelIndex } from '../../helpers/generateSpinWheelIndex'
import { UserActivityService } from '../player/userActivity.service'
import {
  ACTION_TYPE,
  BONUS_TYPE,
  TRANSACTION_STATUS,
  USER_ACTIVITIES_TYPE,
  BONUS_STATUS,
  AMOUNT_TYPE
} from '../../utils/constants/constant'
import { plus, round } from 'number-precision'
import { prepareWheelConfiguration } from '../../utils/common'
import WalletEmitter from '../../socket-resources/emitter/wallet.emitter'

export class GenerateSpinService extends ServiceBase {
  async run () {
    const {
      Wallet: WalletModel,
      Bonus: BonusModel,
      UserBonus: UserBonusModel,
      CasinoTransaction: CasinoTransactionModel,
      WheelDivisionConfiguration: WheelDivisionConfigurationModel
    } = this.context.dbModels

    const transaction = this.context.sequelizeTransaction
    const { detail } = this.context.req.user
    try {
      let bonusActivated = false
      const isWheelSpinBonusExist = await BonusModel.findOne({
        where: {
          isActive: true,
          bonusType: BONUS_TYPE.WHEEL_SPIN_BONUS
        }
      })
      if (!isWheelSpinBonusExist) {
        return this.addError('BonusNotFoundErrorType')
      }
      const wheelConfiguration = await WheelDivisionConfigurationModel.findAll({
        order: [['wheelDivisionId', 'ASC']]
      })
      if (wheelConfiguration) {
        const updatedWheelConfig = await prepareWheelConfiguration(detail.userId, wheelConfiguration)
        const { object, index } = await generateSpinWheelIndex(updatedWheelConfig)
        bonusActivated = true
        const userWallet = await WalletModel.findOne({
          where: { ownerId: detail.userId },
          lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
          transaction
        })

        let balanceObj = {
          beforeScBalance:
            (userWallet.scCoin.bsc || 0) +
            (userWallet.scCoin.psc || 0) +
            (userWallet.scCoin.wsc || 0),
          beforeGcBalance: userWallet.gcCoin
        }

        userWallet.gcCoin = +round(+plus(+userWallet.gcCoin, +object.gc), 2)
        userWallet.scCoin = {
          ...userWallet.scCoin,
          bsc: +round(+plus(+userWallet.scCoin.bsc, +object.sc), 2)
        }

        balanceObj = {
          ...balanceObj,
          afterScBalance: +round(((+userWallet.scCoin.bsc || 0) + (userWallet.scCoin.psc || 0) + (userWallet.scCoin.wsc || 0)), 2),
          afterGcBalance: +round((+userWallet.gcCoin || 0), 2),
          wheelDivisionId: object.wheelDivisionId
        }
        const userBonusObj = {
          bonusId: isWheelSpinBonusExist.bonusId,
          userId: detail.userId,
          bonusType: BONUS_TYPE.WHEEL_SPIN_BONUS,
          status: BONUS_STATUS.CLAIMED,
          scAmount: object.sc,
          gcAmount: object.gc,
          claimedAt: new Date()
        }
        const isCreated = await UserBonusModel.create(userBonusObj, {
          transaction
        })
        const transactionObj = {
          userId: detail.userId,
          actionType: BONUS_TYPE.WHEEL_SPIN_BONUS,
          actionId: ACTION_TYPE.CREDIT,
          status: TRANSACTION_STATUS.SUCCESS,
          walletId: userWallet.walletId,
          currencyCode: userWallet.currencyCode,
          userBonusId: isCreated.userBonusId,
          amountType: AMOUNT_TYPE.SC_GC_COIN,
          roundId: 'NULL',
          sc: object.sc,
          gc: object.gc,
          moreDetails: balanceObj,
          transactionId: `${new Date(
            new Date().toString().split('GMT')[0] + ' UTC'
          ).toISOString()}-TRANSACTION`
        }

        await CasinoTransactionModel.create(transactionObj, { transaction })
        await UserActivityService.execute(
          {
            activityType: USER_ACTIVITIES_TYPE.WHEEL_SPIN_BONUS,
            userId: detail.userId
          },
          this.context
        )
        await userWallet.save({ transaction })
        await transaction.commit()

        setTimeout(() => {
          WalletEmitter.emitUserWalletBalance({ scCoin: balanceObj.afterScBalance, gcCoin: balanceObj.afterGcBalance }, detail.userId)
        }, 5000)

        return {
          success: true,
          wheelConfiguration: { sc: object.sc, gc: object.gc },
          index,
          bonusActivated
        }
      } else {
        return { success: true, wheelConfiguration: null, index: -1 }
      }
    } catch (error) {
      await transaction.rollback()
      console.log('Error Occur in Wheel Spin Bonus Service', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
