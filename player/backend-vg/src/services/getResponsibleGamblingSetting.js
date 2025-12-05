import { RESPONSIBLE_GAMBLING_STATUS } from '../utils/constants/constant'
import ServiceBase from './serviceBase'

export class GetResponsibleGamblingSetting extends ServiceBase {
  async run () {
    const {
      responsibleGamblingType
    } = this.args

    const { detail } = this.context.req.user

    const {
      ResponsibleGambling: ResponsibleGamblingModel
    } = this.context.dbModels

    try {
      const whereConditions = {
        userId: detail.userId,
        status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE,
        responsibleGamblingType
      }

      const history = await ResponsibleGamblingModel.findAll({
        attributes: ['limitType', 'responsibleGamblingType', 'amount', 'status', 'createdAt', 'sessionReminderTime', 'responsibleGamblingId'],
        where: whereConditions,
        order: [['createdAt', 'DESC']]
      })

      return { history }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
