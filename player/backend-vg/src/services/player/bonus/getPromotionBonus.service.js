import ServiceBase from '../../serviceBase'
import { prepareImageUrl } from '../../../utils/common'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { BONUS_STATUS, BONUS_TYPE } from '../../../utils/constants/constant'

export class GetPromotionBonusService extends ServiceBase {
  async run () {
    const {
      dbModels: { Bonus: BonusModel, UserBonus: UserBonusModel }
    } = this.context

    const { id: userId } = this.args

    const isAffiliateBonusActive = await BonusModel.findOne({
      attributes: ['bonusId', 'isActive'],
      where: {
        bonusType: BONUS_TYPE.AFFILIATE_BONUS,
        isActive: true
      }
    })

    if (!isAffiliateBonusActive) return this.addError('BonusNotFoundErrorType')

    const userBonus = await UserBonusModel.findOne({
      where: {
        userId,
        status: BONUS_STATUS.PENDING,
        bonusType: BONUS_TYPE.AFFILIATE_BONUS
      }
    })

    if (!userBonus) return this.addError('PromocodeDoesNotExistForThisUserErrorType')

    const bonusData = await BonusModel.findOne({
      attributes: ['bonusName', 'description', 'btnText', 'termCondition', 'imageUrl'],
      where: { isActive: true, bonusType: BONUS_TYPE.AFFILIATE_BONUS }
    })

    bonusData.dataValues.gcAmount = userBonus.gcAmount
    bonusData.dataValues.scAmount = userBonus.scAmount

    if (bonusData.imageUrl) bonusData.dataValues.imageUrl = prepareImageUrl(bonusData.imageUrl)

    return { data: bonusData || {}, success: true, message: SUCCESS_MSG.GET_SUCCESS }
  }
}
