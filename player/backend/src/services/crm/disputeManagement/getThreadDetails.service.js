import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    threadId: { type: 'string' }
  },
  required: ['userId', 'threadId']
})

export class GetThreadDetailsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { threadId, userId } = this.args
      const mainThread = await this.context.sequelize.models.mainThread.findOne({
        where: { userId, id: threadId },
        include: {
          model: this.context.sequelize.models.threadMessage,
	  separate: true,
          order: [['createdAt', 'ASC']],
          required: false,
          include: [{
            model: this.context.sequelize.models.threadAttachement,
            required: false
          }, {
            model: this.context.sequelize.models.adminUser,
            required: false,
            attributes: ['username']
          }, {
            model: this.context.sequelize.models.user,
            required: false,
            attributes: ['username']
          }]
        }
      })
      await this.context.sequelize.models.threadMessage.update({ userRead: true }, { where: { threadId, userId } })
      return { mainThread }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
