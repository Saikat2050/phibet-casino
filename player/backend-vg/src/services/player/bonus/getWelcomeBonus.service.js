import ServiceBase from '../../serviceBase'
import { prepareImageUrl } from '../../../utils/common'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { BONUS_TYPE } from '../../../utils/constants/constant'
import { Op } from 'sequelize'

export class GetWelcomeBonusService extends ServiceBase {
  async run () {
    try {
      const {
        Bonus: BonusModel
      } = this.context.dbModels
      const { detail } = this.context.req.user

      if (detail?.moreDetails?.notNeedWelcomeBonus) {
        return { data: {}, success: true, message: SUCCESS_MSG.GET_SUCCESS }
      }

      const bonusData = await BonusModel.findOne({
        attributes: ['bonusName', 'gcAmount', 'scAmount', 'description', 'btnText', 'termCondition', 'imageUrl'],
        where: {
          isActive: true,
          bonusType: BONUS_TYPE.WELCOME_BONUS,
          lastActivatedTime: { [Op.lt]: new Date(detail.createdAt) },
          validFrom: { [Op.lte]: new Date() }
        }
      })

      // if (!bonusData) return this.addError('BonusNotFoundErrorType')
      if (bonusData?.imageUrl) bonusData.dataValues.imageUrl = prepareImageUrl(bonusData.imageUrl)
      return { data: bonusData || {}, success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
