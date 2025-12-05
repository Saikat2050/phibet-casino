import ServiceBase from '../../serviceBase'
import { prepareImageUrl } from '../../../utils/common'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class GetAllBonusService extends ServiceBase {
  async run () {
    try {
      const {
        Bonus: BonusModel
      } = this.context.dbModels
      const bonusData = await BonusModel.findAll({
        where: {
          isActive: true
        }
      })

      Promise.all(bonusData.map(bonus => {
        if (bonus.imageUrl) bonus.dataValues.imageUrl = prepareImageUrl(bonus.imageUrl)
        return true
      }))

      return { data: bonusData || {}, success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
