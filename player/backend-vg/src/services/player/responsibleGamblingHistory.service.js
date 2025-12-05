import { Op } from 'sequelize'
import ServiceBase from '../serviceBase'

export class ResponsibleGamingHistory extends ServiceBase {
  async run () {
    const {
      limitType,
      startDate
    } = this.args

    const { detail } = this.context.req.user

    const {
      ResponsibleGambling: ResponsibleGamblingModel
    } = this.context.dbModels

    try {
      const whereConditions = {
        userId: detail.userId
      }

      if (limitType) {
        whereConditions.responsibleGamblingType = limitType
      }

      if (startDate) {
        whereConditions.createdAt = {
          [Op.gte]: new Date(startDate)
        }
      }

      const history = await ResponsibleGamblingModel.findAll({
        attributes: ['limitType', 'responsibleGamblingType', 'amount', 'status', 'createdAt', 'sessionReminderTime'],
        where: whereConditions,
        order: [['createdAt', 'DESC']]
      })

      return { history }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
