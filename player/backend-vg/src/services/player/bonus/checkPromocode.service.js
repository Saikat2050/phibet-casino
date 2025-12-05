import ServiceBase from '../../serviceBase'
import { BONUS_TYPE } from '../../../utils/constants/constant'

export class CheckAffiliatePromocodeService extends ServiceBase {
  async run () {
    const {
      dbModels: { PromotionCode: PromotionCodeModel, Bonus: BonusModel, UserBonus: UserBonusModel }
    } = this.context

    const { promocode } = this.args

    const isAffiliateBonusActive = await BonusModel.findOne({
      attributes: ['bonusId', 'isActive'],
      where: {
        bonusType: BONUS_TYPE.AFFILIATE_BONUS,
        isActive: true
      }
    })

    if (!isAffiliateBonusActive) return { success: false, isPromocodeValid: false, message: 'Promocode Bonus Not Active !!!' }

    const isValidPromoCode = await PromotionCodeModel.findOne({
      where: {
        promocode,
        isActive: true
        // validTill: { [Op.gte]: new Date() }
      }
    })

    if (!isValidPromoCode) return { success: false, isPromocodeValid: false, message: 'Invalid Promocode !!!' }

    if (isValidPromoCode.validTill && new Date(isValidPromoCode.validTill) < new Date()) return { success: false, isPromocodeValid: false, message: 'Invalid Promocode !!!' }

    const uses = await UserBonusModel.count({ where: { promocodeId: isValidPromoCode.promocodeId } })

    if (isValidPromoCode.maxUses && +isValidPromoCode.maxUses <= +uses) return { success: false, isPromocodeValid: false, message: 'Maximum times Promocode Used !!!' }

    return {
      success: true,
      isPromocodeValid: !!isValidPromoCode,
      message: 'Promocode Applied Successfully !!!'
    }
  }
}
