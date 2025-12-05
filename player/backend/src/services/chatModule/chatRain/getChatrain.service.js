import ServiceBase from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    groupId: { type: 'number' }
  },
  required: ['groupId']
})

export class GetChatRainService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const ChatRainModel = this.context.sequelize.models.chatRain
    const { groupId } = this.args

    try {
      const chatRainDetails = await ChatRainModel.findOne({
        where: { chatGroupId: groupId, isClosed: false },
        limit: 1
      })

      return { chatRainDetails: chatRainDetails || {} }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
