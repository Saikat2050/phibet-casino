import ServiceBase from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'

const schema = {
  type: 'object',
  properties: {
    reportedUserId: { type: 'string' },
    groupId: { type: 'string' },
    userId: { type: 'string' },
    description: { type: 'string', default: null }
  },
  required: ['groupId', 'reportedUserId', 'userId']
}

const constraints = ajv.compile(schema)

export class blockUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const ReportedUserModel = this.context.sequelize.models.reportedUser
    const UserModel = this.context.sequelize.models.user
    const ChatGroupModel = this.context.sequelize.models.chatGroup
    const { description, reportedUserId, groupId, userId } = this.args

    const createReport = {
      actioneeId: userId,
      reportedUserId,
      description,
      groupId
    }

    const whereCondition = {
      actioneeId: userId,
      reportedUserId
    }

    if (userId.toString() === reportedUserId.toString()) return this.addError('UserCanNotReportErrorType')
    try {
      const isUserReported = await ReportedUserModel.findOne({ where: whereCondition, transaction: this.context.sequelizeTransaction })
      if (isUserReported) {
        if (!isUserReported.isUnblocked) return { message: 'User Already reported' }
        else {
          isUserReported.isUnblocked = false
          const report = await isUserReported.save({ transaction: this.context.sequelizeTransaction })
          return { message: 'User reported successfully', report }
        }
      } else {
        const reportedUserDetail = await UserModel.findByPk(reportedUserId)
        const reportingGroupDetail = await ChatGroupModel.findByPk(groupId)
        if (!reportedUserDetail || !reportingGroupDetail) return this.addError('InvalidInputErrorType')

        const report = await ReportedUserModel.create(createReport,
          { transaction: this.context.sequelizeTransaction })

        return { message: 'User reported successfully', report }
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
