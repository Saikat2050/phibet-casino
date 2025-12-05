import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    messageId: { type: 'string' }
  },
  required: ['userId', 'messageId']
})

export class UpdateMessageReadService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { messageId, userId } = this.args
      const transaction = this.context.sequelizeTransaction
      const threadMessages = await this.context.sequelize.models.threadMessage.update({ userRead: true }, {
        where: { userId, id: messageId },
        transaction
      })
      return { threadMessages }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
