import ServiceBase from '@src/libs/serviceBase'
import { MAX_CHAT_CHARACTERS, URL_CHAT_MESSAGE, DELETED_MESSAGE, MESSAGE_TYPE } from '@src/utils/constants/chat.constants.js'
import { LiveChatsEmitter } from '@src/socket-resources/emitters/chat.emitter'
import { containsLink, isContainOffensiveWord } from '@src/utils/chat.utils'
import Sequelize from 'sequelize'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: ['number'] },
    message: { type: ['string'] },
    recipientId: { type: ['number', 'null'] },
    isPrivate: { type: ['boolean', 'null'] },
    gif: { type: 'object' },
    messageType: { enum: Object.values(MESSAGE_TYPE) },
    replyMessageId: { type: ['number', 'null'] },
    groupId: { type: 'number' }
  },
  required: ['userId', 'messageType', 'groupId']
})

export class SendMessageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      message: MessageModel,
      userChatGroup: UserChatGroupModel,
      offensiveWord: OffensiveWordModel,
      user: UserModel,
      currency: CurrencyModel
    } = this.context.sequelize.models
    const sequelizeTransaction = this.context.sequelizeTransaction

    try {
      const { message, recipientId, isPrivate, groupId, userId, gif, messageType, replyMessageId } = this.args

      let isOffensiveWord = false
      let checkUrl = false
      if (message) {
        if (message.length > MAX_CHAT_CHARACTERS) return this.addError('ExceedChatLengthErrorType')
        const offensiveWords = await OffensiveWordModel.findAll({ attributes: ['word'] })
        const offensiveWordsArray = offensiveWords.map(row => row.word)
        isOffensiveWord = isContainOffensiveWord(message, offensiveWordsArray)
        checkUrl = containsLink(message)
      }
      const user = await UserModel.findByPk(userId)
      if (!user) return this.addError('UserNotExistsErrorType')

      const userChatGroupPresent = await UserChatGroupModel.findOne({
        where: { userId: user.id, chatGroupId: groupId },
        transaction: sequelizeTransaction
      })
      if (!userChatGroupPresent) return this.addError('GroupNotJoinedByUser')

      const createChat = {
        actioneeId: userId,
        chatGroupId: groupId || null,
        message,
        isContainOffensiveWord: isOffensiveWord,
        recipientId: recipientId || null,
        isPrivate: isPrivate || false,
        messageBinary: gif || null,
        messageType: messageType,
        replyMessageId: replyMessageId
      }
      const userChat = await MessageModel.create(createChat, { transaction: sequelizeTransaction })
      const replyMessage = replyMessageId ? await this._attachReplyMessage(replyMessageId, sequelizeTransaction, MessageModel, UserModel, CurrencyModel) : null

      LiveChatsEmitter.emitLiveChats(
        {
          messageId: userChat.id,
          id: userChat.id,
          message: (isOffensiveWord) ? `${DELETED_MESSAGE}` : (checkUrl) ? `${URL_CHAT_MESSAGE}` : message || null,
          userId: parseInt(userId),
          groupId: groupId,
          isContainOffensiveWord: isOffensiveWord,
          recipientId: null,
          recipientUser: null,
          gif,
          messageType,
          createdAt: new Date(),
          user: {
            profilePicture: user.avatarImage,
            username: user.username,
            rankingLevel: user.userSettings?.displayLevel === 'true' ? user.rankingLevel : null,
            rankingName: user.userSettings?.displayLevel === 'true' ? user.rankingName : null
          },
          sharedEvent: {},
          replyMessage
        },
        groupId
      )

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }

  async _attachReplyMessage (replyMessageId, sequelizeTransaction, MessageModel, UserModel, CurrencyModel) {
    const messageAttributes = [
      [Sequelize.literal(`CASE WHEN "is_contain_offensive_word" = true THEN '${DELETED_MESSAGE}' ELSE "message" END`), 'message'],
      ['actionee_id', 'userId'],
      // [Sequelize.literal('CASE WHEN "user"."chat_settings"->>\'displayGIF\' = \'true\' THEN "message_binary" END'), 'gif'],
      'recipientId',
      'id',
      ['message_binary', 'gif'],
      'isContainOffensiveWord',
      ['message_type', 'messageType'],
      'createdAt'
    ]

    const message = await MessageModel.findOne({
      where: { id: replyMessageId },
      subQuery: false,
      attributes: messageAttributes,
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: ['id', 'username', ['image_url', 'profilePicture']]
        },
        {
          model: UserModel,
          as: 'recipientUser',
          attributes: ['id', 'username', ['image_url', 'profilePicture']]
        },
        {
          model: CurrencyModel,
          attributes: ['id', 'name', 'code', 'symbol']
        }
      ],
      transaction: sequelizeTransaction
    })

    return message
  }
}
