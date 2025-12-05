import moment from 'moment'
import ServiceBase from '../../serviceBase'
import { prepareImageUrl } from '../../../utils/common'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { BONUS_TYPE, USER_ACTIVITIES_TYPE } from '../../../utils/constants/constant'
import { Op } from 'sequelize'
import socketServer from '../../../libs/socketServer'

export class GetDailyBonusServiceV2 extends ServiceBase {
  async run () {
    try {
      const {
        req: {
          user: { detail }
        },
        dbModels: {
          Bonus: BonusModel,
          UserActivities: UserActivitiesModel
        }
      } = this.context
      const skippingBonusAvailable = await socketServer.redisClient.get(`SKIP_DAILY_BONUS_${detail.userId}`)
      if (skippingBonusAvailable && skippingBonusAvailable === 'true') {
        return { data: {}, success: true, message: SUCCESS_MSG.GET_SUCCESS }
      }

      const currentDateDaily = moment()
      const bonusData = await BonusModel.findOne({
        attributes: ['bonusName', 'gcAmount', 'scAmount', 'description', 'btnText', 'termCondition', 'imageUrl'],
        where: {
          isActive: true,
          bonusType: BONUS_TYPE.DAILY_BONUS,
          validFrom: { [Op.lte]: new Date() }
        }
      })

      // const signupDateAdd24hrs = moment(detail.createdAt).add(24, 'hours')
      // if (!(currentDateDaily >= signupDateAdd24hrs)) return this.addError('DailyBonusNotFoundErrorType')

      if (!bonusData) return this.addError('DailyBonusNotFoundErrorType')

      const isBonusClaimed = await UserActivitiesModel.findOne({
        where: {
          userId: detail.userId,
          activityType: { [Op.in]: [USER_ACTIVITIES_TYPE.DAILY_BONUS_CLAIMED] }
        },
        order: [['created_at', 'DESC']]
      })

      const createdAtDate = moment(new Date(isBonusClaimed?.createdAt))

      if (isBonusClaimed && Math.abs(currentDateDaily.diff(createdAtDate, 'minutes')) < 1440) {
        return { data: {}, success: true, message: SUCCESS_MSG.GET_SUCCESS }
      }

      if (bonusData?.imageUrl) bonusData.dataValues.imageUrl = prepareImageUrl(bonusData.imageUrl)

      return { data: bonusData || {}, success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
