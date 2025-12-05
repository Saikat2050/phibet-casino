import { Op } from 'sequelize'
import moment from 'moment/moment'
import ServiceBase from '../../serviceBase'
import { plus, round } from 'number-precision'
import { UserActivityService } from '../userActivity.service'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import { ACTION_TYPE, AMOUNT_TYPE, BONUS_STATUS, BONUS_TYPE, TRANSACTION_STATUS, USER_ACTIVITIES_TYPE } from '../../../utils/constants/constant'
import socketServer from '../../../libs/socketServer'

export class ClaimBonusServiceV2 extends ServiceBase {
  async run () {
    const {
      Wallet: WalletModel,
      Bonus: BonusModel,
      UserBonus: UserBonusModel,
      CasinoTransaction: CasinoTransactionModel,
      UserActivities: UserActivitiesModel
    } = this.context.dbModels

    const { detail } = this.context.req.user
    const transaction = this.context.sequelizeTransaction
    const { needDailyBonus } = this.args

    try {
      if (needDailyBonus && needDailyBonus === 'false') {
        const secondsLeftToEndToday = moment.duration(moment().endOf('day').diff(moment())).asSeconds()
        await socketServer.redisClient.set(`SKIP_DAILY_BONUS_${detail.userId}`, 'true', 'EX', parseInt(secondsLeftToEndToday))
        return { success: true, message: SUCCESS_MSG.DAILY_BONUS_DECLINED }
      }
      const userWallet = await WalletModel.findOne({
        where: { ownerId: detail.userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      const isBonusClaimed = await UserActivitiesModel.findOne({
        where: {
          userId: detail.userId,
          activityType: { [Op.in]: [USER_ACTIVITIES_TYPE.DAILY_BONUS_CLAIMED] }
        },
        order: [['created_at', 'DESC']],
        transaction
      })

      const createdAtDate = moment(new Date(isBonusClaimed?.createdAt))

      const currentDateDaily = moment()
      // const signupDateAdd24hrs = moment(detail.createdAt).add(24, 'hours')
      // if (!(currentDateDaily >= signupDateAdd24hrs)) return this.addError('DailyBonusNotFoundErrorType')

      if (isBonusClaimed && Math.abs(currentDateDaily.diff(createdAtDate, 'minutes')) < 1440) {
        return this.addError('BonusClaimedErrorType', '')
      }

      const bonusData = await BonusModel.findOne({
        where: {
          isActive: true,
          bonusType: BONUS_TYPE.DAILY_BONUS
        },
        transaction
      })

      if (bonusData?.validFrom <= moment(new Date()).format('YYYY-MM-DD')) {
        return this.addError('DailyBonusNotFoundErrorType', '')
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
        bonusType: BONUS_TYPE.DAILY_BONUS,
        scAmount: bonusData.scAmount,
        gcAmount: bonusData.gcAmount,
        status: BONUS_STATUS.CLAIMED,
        expireAt: moment().add(24, 'hours')
      }

      const isCreated = await UserBonusModel.create(userBonusObj, { transaction })

      const transactionObj = {
        userId: detail.userId,
        actionType: BONUS_TYPE.DAILY_BONUS,
        actionId: ACTION_TYPE.CREDIT,
        status: TRANSACTION_STATUS.SUCCESS,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        userBonusId: isCreated.userBonusId,
        sc: bonusData.scAmount,
        gc: bonusData.gcAmount,
        amountType: AMOUNT_TYPE.SC_GC_COIN,
        roundId: 'NULL',
        moreDetails: balanceObj,
        transactionId: `${new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString()}-TRANSACTION`
      }

      await CasinoTransactionModel.create(transactionObj, { transaction })

      await UserActivityService.execute({ activityType: USER_ACTIVITIES_TYPE.DAILY_BONUS_CLAIMED, userId: detail.userId }, this.context)

      await userWallet.save({ transaction })

      await transaction.commit()

      WalletEmitter.emitUserWalletBalance(socketObj, detail.userId)

      return { success: true, message: SUCCESS_MSG.AVAIL_BONUS, userWallet }
    } catch (error) {
      await transaction.rollback()
      console.log('Error in daily bonus service', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
