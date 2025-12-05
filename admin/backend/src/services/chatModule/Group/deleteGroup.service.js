import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    chatGroupId: { type: 'string' }
  },
  required: ['chatGroupId']
})

export default class DeleteGroupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const ChatGroupModel = this.context.sequelize.models.chatGroup
    const transaction = this.context.sequelizeTransaction

    try {
      const { chatGroupId } = this.args
      await ChatGroupModel.destroy({ where: { id: chatGroupId }, transaction })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
