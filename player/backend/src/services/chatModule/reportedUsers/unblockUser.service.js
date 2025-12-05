import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const schema = {
  type: 'object',
  properties: {
    reportedUserId: { type: 'number' },
    groupId: { type: 'number' }
  },
  required: ['groupId', 'reportedUserId']
}

const constraints = ajv.compile(schema)

export class UnblockUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const ReportedUserModel = this.context.sequelize.models.reportedUser

    const { reportedUserId, groupId } = this.args
    try {
      const reportData = await ReportedUserModel.findOne({
        where: { reportedUserId, groupId }
      })
      if (!reportData) return this.addError('InvalidInputErrorType')
      const updateReport = await ReportedUserModel.update({ isUnblocked: true },
        { where: { reportedUserId, groupId }, transaction: this.context.sequelizeTransaction })

      return { message: 'Report updated successfully', updateReport }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
