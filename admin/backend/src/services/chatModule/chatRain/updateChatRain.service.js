import { ServiceBase } from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { DELETED_MESSAGE, MAX_MESSAGE_LENGTH } from '@src/utils/constants/chat.constants'
import { isContainOffensiveWord } from '@src/utils/chat.utils'
import { LiveChatsRainEmitter } from '@src/socket-resources/emitters/chatRain.emitter'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    chatRainId: { type: 'number' },
    name: { type: 'string' },
    description: { type: ['string', 'null'] },
    prizeMoney: { type: 'number' },
    currency: { type: 'string' },
    chatGroupId: { type: 'number' }
  },
  required: ['chatRainId']
})

export default class UpdateChatRainService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      chatRain: ChatRainModel,
      chatRainUser: ChatRainUserModel,
      offensiveWord: OffensiveWordModel,
      chatGroup: ChatGroupModel
    } = this.context.sequelize.models
    const transaction = this.context.sequelizeTransaction
    const { name, description, prizeMoney, currency, chatRainId, chatGroupId, playersCount } = this.args

    try {
      const chatGroupExist = await ChatGroupModel.findByPk(chatGroupId)
      if (!chatGroupExist) return this.addError('InvalidChatGroupErrorType')

      const chatRain = await ChatRainModel.findOne({
        where: { id: chatRainId, chatGroupId },
        include: {
          model: ChatRainUserModel,
          attributes: ['id']
        }
      })
      if (!chatRain) return this.addError('ChatRainDoesNotExistErrorType')
      if (chatRain?.chatRainUsers?.length) return this.addError('AlreadyGrabbedChatRainErrorType')

      const newChatRain = await ChatRainModel.update({ name, description, prizeMoney, currency }, { where: { id: chatRainId }, transaction })

      let isOffensiveWord
      if (name !== chatRain.name) {
        if (name.length > MAX_MESSAGE_LENGTH) return this.addError('ExceedChatLengthErrorType')
        const offensiveWords = await OffensiveWordModel.findAll({ attributes: ['word'], raw: true })

        const offensiveWordsArray = offensiveWords.map(row => row.word)
        isOffensiveWord = isContainOffensiveWord(name, offensiveWordsArray)
      }

      newChatRain.name = isOffensiveWord ? DELETED_MESSAGE : name || null
      newChatRain.description = description
      newChatRain.description = description
      newChatRain.prizeMoney = prizeMoney
      newChatRain.currency = currency
      newChatRain.playersCount = playersCount

      LiveChatsRainEmitter.emitLiveChatRain({
        id: chatRain.id,
        name: isOffensiveWord ? `${DELETED_MESSAGE}` : name || null,
        description: chatRain.description,
        prizeMoney: chatRain.prizeMoney,
        currency: chatRain.currency,
        isClosed: chatRain.isClosed,
        chatGroupId: chatRain.chatGroupId,
        playersCount
      }, chatGroupId)

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
