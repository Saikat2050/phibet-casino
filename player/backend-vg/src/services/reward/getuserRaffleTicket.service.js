import moment from 'moment'
import { Op } from 'sequelize'
import ServiceBase from '../serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export default class UserRaffleTicketService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Raffles: RafflesModel,
        RafflesEntry: RafflesEntryModel
      }
    } = this.context
    const { detail: userDetail } = this.context.req.user
    let { endDate = null, startDate = null, page, limit, orderBy, sort } = this.args
    if (!startDate) {
      const newDate = new Date()
      newDate.setDate(newDate.getDate() - 7)
      startDate = new Date(newDate.setHours(0, 0, 0, 0)).toISOString()
      endDate = new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
    }
    if (moment(startDate) > moment(endDate)) {
      return this.addError('InvalidDateErrorType')
    }

    const { pageNo, size } = pageValidation(page, limit)
    startDate = new Date(startDate).toISOString()
    endDate = new Date(endDate).toISOString()
    const raffleDetail = await RafflesModel.findAll({
      attributes: ['raffleId', 'title', 'startDate', 'endDate'],
      include: [
        {
          model: RafflesEntryModel,
          as: 'entries',
          attributes: {
            exclude: ['userId', 'isActive', 'updatedAt', 'raffleId']
          },
          where: {
            userId: userDetail.userId,
            createdAt: {
              [Op.between]: [startDate, endDate]
            }
          }
        }
      ],
      limit: size,
      offset: ((pageNo - 1) * size),
      order: [[orderBy || 'startDate', sort || 'DESC']]
    })
    let totalCount = 0
    const transformData = raffleDetail.map((raffle, index) => {
      totalCount = index + 1
      return {
        ...raffle.dataValues,
        entries: raffle.dataValues.entries.map(entry => `#${entry.entryId}`)
      }
    })
    return {
      userTickets: { rows: transformData, count: +totalCount || 0 } || {},
      message: SUCCESS_MSG.GET_SUCCESS,
      success: true
    }
  }
}
