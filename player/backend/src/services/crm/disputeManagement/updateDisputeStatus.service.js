import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { QUERY_STATUS } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    threadId: { type: 'string' },
    userId: { type: 'string' },
    status: { enum: [QUERY_STATUS.RESOLVED, QUERY_STATUS.REOPENED], default: QUERY_STATUS.RESOLVED }
  },
  required: ['threadId', 'status', 'userId']
})

export class UpdateDisputeStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const transaction = this.context.sequelizeTransaction
      const mainThread = await this.context.sequelize.models.mainThread.findOne({
        where: { id: this.args.threadId, userId: this.args.userId }
      })
      if (!mainThread) return this.addError('MessageThreadDoestNotExistsErrorType')

      mainThread.status = this.args.status
      await mainThread.save({ transaction })
      return { mainThread }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
