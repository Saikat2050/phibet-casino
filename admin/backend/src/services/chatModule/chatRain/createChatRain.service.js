import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { DELETED_MESSAGE, MAX_MESSAGE_LENGTH, MINIMUM_PER_USER_CHAT_RAIN } from '@src/utils/constants/chat.constants'
import { isContainOffensiveWord } from '@src/utils/chat.utils'
import { LiveChatsRainEmitter } from '@src/socket-resources/emitters/chatRain.emitter'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: ['string', 'null'] },
    prizeMoney: { type: 'number' },
    currency: { type: 'string' },
    playersCount: { type: 'number', minimum: 1, maximum: 2000 }, // we can change player count minimum and maximum as per our requirement
    adminUserId: { type: 'number' },
    chatGroupId: { type: 'number' }
  },
  required: ['name', 'prizeMoney', 'currency', 'playersCount', 'adminUserId', 'chatGroupId']
})

export default class CreateChatRainService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      chatRain: ChatRainModel,
      offensiveWord: OffensiveWordModel,
      adminUser: AdminUserModel,
      chatGroup: ChatGroupModel
    } = this.context.sequelize.models

    const transaction = this.context.sequelizeTransaction
    const { name, description, prizeMoney, currency, playersCount, adminUserId, chatGroupId } = this.args
    let result

    try {
      if (prizeMoney / playersCount < MINIMUM_PER_USER_CHAT_RAIN) return this.addError('MinimumChatRainPerUserErrorType')

      const chatGroupExist = await ChatGroupModel.findByPk(chatGroupId)
      if (!chatGroupExist) return this.addError('InvalidChatGroupErrorType')

      const admin = await AdminUserModel.findOne({
        attributes: ['firstName', 'lastName', 'username', 'email', 'adminRoleId', 'id'],
        where: { id: adminUserId },
        raw: true
      })
      if (!admin) return this.addError('AdminUserNotFoundErrorType')

      if (name) {
        if (name.length > MAX_MESSAGE_LENGTH) return this.addError('ExceedChatLengthErrorType')
        const offensiveWords = await OffensiveWordModel.findAll({ attributes: ['word'], raw: true })

        const offensiveWordsArray = offensiveWords.map(row => row.word)
        result = isContainOffensiveWord(name, offensiveWordsArray)
      }

      const chatRainObj = {
        name,
        description,
        prizeMoney,
        currencyId: currency,
        isClosed: false,
        playersCount,
        adminId: adminUserId,
        chatGroupId
      }
      const chatRain = await ChatRainModel.create(chatRainObj, { transaction })

      LiveChatsRainEmitter.emitLiveChatRain({
        id: chatRain.id,
        name: (result) ? `${DELETED_MESSAGE}` : name || null,
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
