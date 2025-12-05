import ServiceBase from '../serviceBase'
import { Op } from 'sequelize'
import { SUCCESS_MSG } from '../../utils/constants/success'
export default class GetRafflePromotion extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Raffles: RafflesModel
      }
    } = this.context

    const currentDate = new Date()
    const raffleDetail = await RafflesModel.findOne({
      where: {
        startDate: { [Op.lte]: currentDate },
        endDate: { [Op.gte]: currentDate }
      },
      attributes: ['raffleId', 'title', 'subHeading', 'endDate', 'isActive'],
      raw: true
    })

    if (!raffleDetail) return this.addError('GiveawaysNotFoundErrorType')
    if (!raffleDetail.isActive) return this.addError('NoAnyGiveawaysActive')
    return {
      rafflePromotion: raffleDetail,
      message: SUCCESS_MSG.GET_SUCCESS,
      success: true
    }
  }
}
