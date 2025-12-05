import ServiceBase from '../serviceBase'
import {
  RESPONSIBLE_GAMBLING_STATUS
} from '../../utils/constants/constant'

export class GetResponsibleGambling extends ServiceBase {
  async run () {
    const { detail } = this.context.req.user

    const {
      ResponsibleGambling: ResponsibleGamblingModel
    } = this.context.dbModels

    try {
      const whereConditions = {
        userId: detail.userId,
        status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE,
        isRemoved: false
      }

      const history = await ResponsibleGamblingModel.findAll({
        attributes: ['limitType', 'responsibleGamblingType', 'amount', 'status', 'createdAt', 'sessionReminderTime'],
        where: whereConditions,
        order: [['createdAt', 'DESC']]
      })
      const responsibleGambling = {}
      for (const data of history) {
        if (data?.responsibleGamblingType === '2') {
          if (data?.limitType === '1') {
            responsibleGambling.dailyDepositLimit = { amount: data?.amount, createdAt: data?.createdAt }
          } else if (data?.limitType === '2') {
            responsibleGambling.weeklyDepositLimit = { amount: data?.amount, createdAt: data?.createdAt }
          } else if (data?.limitType === '3') {
            responsibleGambling.monthlyDepositLimit = { amount: data?.amount, createdAt: data?.createdAt }
          } else {
            responsibleGambling.dailyDepositLimit = {}
            responsibleGambling.weeklyDepositLimit = {}
            responsibleGambling.monthlyDepositLimit = {}
          }
        } else if (data?.responsibleGamblingType === '1') {
          if (data?.limitType === '1') {
            responsibleGambling.dailyBetLimit = { amount: data?.amount, createdAt: data?.createdAt }
          } else if (data?.limitType === '2') {
            responsibleGambling.weeklyBetLimit = { amount: data?.amount, createdAt: data?.createdAt }
          } else if (data?.limitType === '3') {
            responsibleGambling.monthlyBetLimit = { amount: data?.amount, createdAt: data?.createdAt }
          } else {
            responsibleGambling.dailyBetLimit = {}
            responsibleGambling.weeklyBetLimit = {}
            responsibleGambling.monthlyBetLimit = {}
          }
        } else if (data?.responsibleGamblingType === '4') {
          responsibleGambling.timeBreakDuration = { amount: data?.amount, createdAt: data?.createdAt }
        } else if (data?.responsibleGamblingType === '5') {
          const selfData = data?.selfExclusion ? 'yes' : 'no'
          responsibleGambling.selfExclusion = { selfExclusion: selfData, createdAt: data?.createdAt }
        } else {
          responsibleGambling.dailyDepositLimit = {}
          responsibleGambling.weeklyDepositLimit = {}
          responsibleGambling.monthlyDepositLimit = {}
          responsibleGambling.dailyBetLimit = {}
          responsibleGambling.weeklyBetLimit = {}
          responsibleGambling.monthlyBetLimit = {}
          responsibleGambling.selfExclusion = {}
          responsibleGambling.timeBreakDuration = {}
        }
      }
      return { status: 200, responsibleGambling }
    } catch (error) {
      console.log(error)
      this.addError('InternalServerErrorType', error)
    }
  }
}
