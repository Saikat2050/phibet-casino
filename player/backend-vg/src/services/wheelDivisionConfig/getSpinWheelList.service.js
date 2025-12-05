import ServiceBase from '../serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { BONUS_TYPE } from '../../utils/constants/constant'

export class GetSpinWheelListService extends ServiceBase {
  async run () {
    const { dbModels: { WheelDivisionConfiguration: WheelDivisionConfigurationModel, Bonus: BonusModel } } = this.context
    const isWheelSpinBonusExist = await BonusModel.findOne({
      where: {
        isActive: true,
        bonusType: BONUS_TYPE.WHEEL_SPIN_BONUS
      }
    })
    if (!isWheelSpinBonusExist) {
      return this.addError('BonusNotFoundErrorType')
    }
    const wheelConfiguration = await WheelDivisionConfigurationModel.findAll({ attributes: ['sc', 'gc'], order: [['wheelDivisionId', 'ASC']] })
    return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS, wheelConfiguration }
  }
}
