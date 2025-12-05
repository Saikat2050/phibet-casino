import ServiceBase from '../serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { isDailyAndWelcomeBonusClaimed } from '../../utils/common'
export class GetWelcomeBonusDetail extends ServiceBase {
  async run () {
    try {
      const { user: { detail: userData } } = this.args

      delete userData.dataValues.password

      const bonusData = await isDailyAndWelcomeBonusClaimed(userData.userId, userData.createdAt, null)
      return { success: true, data: bonusData, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
