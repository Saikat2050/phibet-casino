import ServiceBase from '@src/libs/serviceBase'
import { LiveChatsRainEmitter } from '@src/socket-resources/emitters/chatRain.emitter'

export class EmitChatRainService extends ServiceBase {

  async run () {
    const ChatRainModel = this.context.sequelize.models.chatRain
    const { chatRainId } = this.args
    try {
      const chatRain = await ChatRainModel.findByPk(chatRainId)
      LiveChatsRainEmitter.emitLiveChatRain(
        {
          chatRainId: chatRain.chatRainId,
          name: chatRain.name,
          description: chatRain.description,
          prizeMoney: chatRain.prizeMoney,
          currency: chatRain.currency,
          isClosed: chatRain.isClosed,
          chatGroupId: chatRain.chatGroupId
        },
        chatRain.chatGroupId
      )
      return { message: 'ChatRain Emited successfully' }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
