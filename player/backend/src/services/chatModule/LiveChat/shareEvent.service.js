import ServiceBase from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { MESSAGE_TYPE } from '@src/utils/constants/public.constants.utils'
import { LiveChatsEmitter } from '@src/socket-resources/emitters/chat.emitter'

/**
 * it provides service of chatting for a user
 * @export
 * @class Chat service
 * @extends {ServiceBase}
 */

const schema = {
  type: 'object',
  properties: {
    chatGroupId: { type: 'number' },
    title: { type: 'string' },
    description: { type: 'string' },
    imageUrl: { type: 'string' },
    redirectUrl: { type: 'string' },
    amount: { type: 'number' },
    currencyId: { type: 'number' },
    eventType: { type: 'string' }
  },
  required: ['chatGroupId', 'title']
}

const constraints = ajv.compile(schema)
export class ShareEventService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { title, description, imageUrl, chatGroupId, redirectUrl, amount, currencyId, eventType, userId } = this.args
    // const userId = 1

    const UserChatModel = this.context.sequelize.models.message
    const UserChatGroupModel = this.context.sequelize.models.userChatGroup
    const UserModel = this.context.sequelize.models.user

    const sequelizeTransaction = this.context.sequelizeTransaction
    try {
      const userData = await UserModel.findOne({ where: { id: userId }, attributes: ['id', 'username', 'imageUrl', 'rankingLevel'], transaction: sequelizeTransaction })

      if (userData) {
        const whereCondition = {
          userId: userData.id,
          chatGroupId: chatGroupId
        }
        const userChatGroupPresent = await UserChatGroupModel.findOne({ where: whereCondition, transaction: sequelizeTransaction })

        if (userChatGroupPresent) {
          const eventDetails = {
            eventTitle: title,
            eventDescription: description,
            eventImage: imageUrl,
            eventURL: redirectUrl,
            eventAmount: amount,
            amountCurrency: currencyId,
            eventType: eventType
          }

          const createChat = {
            actioneeId: userData.id,
            chatGroupId: chatGroupId || null,
            messageType: eventType === MESSAGE_TYPE.CHAT_RAIN ? MESSAGE_TYPE.CHAT_RAIN : MESSAGE_TYPE.SHARED_EVENT,
            isPrivate: false,
            sharedEvent: eventDetails
          }

          const userChat = await UserChatModel.create(createChat, { transaction: sequelizeTransaction })
          // emit the message to room
          LiveChatsEmitter.emitLiveChats(
            {
              messageId: userChat.messageId,
              id: userChat.id,
              userId: +userData.id,
              groupId: chatGroupId,
              recipientId: null,
              recipientUser: null,
              sharedEvent: eventDetails,
              messageType: eventType === MESSAGE_TYPE.CHAT_RAIN ? MESSAGE_TYPE.CHAT_RAIN : MESSAGE_TYPE.SHARED_EVENT,
              createdAt: new Date(),
              user: {
                userName: userData.username,
                profilePicture: userData.imageUrl,
                rankingLevel: userData.rankingLevel
              }
            },
            chatGroupId
          )
          return { message: 'Event shared successfully', isEventShared: true }
        } else {
          return this.addError('GroupNotJoinedByUser')
        }
      }
      return this.addError('InvalidAccessErrorType')
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
