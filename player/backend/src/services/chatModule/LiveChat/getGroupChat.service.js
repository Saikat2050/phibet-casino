import ServiceBase from '@src/libs/serviceBase'
import { DELETED_MESSAGE } from '@src/utils/constants/public.constants.utils'
import Sequelize, { Op } from 'sequelize'
import { MESSAGE_STATUS, MESSAGE_TYPE } from '@src/utils/constants/chat.constants'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    searchMessage: { type: 'string', transform: ['trim'] },
    page: { type: 'number', default: 1 },
    perPage: { type: 'number', default: 15 },
    chatGroupId: { type: 'number' },
    fromDate: { type: 'string', format: 'date' },
    toDate: { type: 'string', format: 'date' },
    userId: { type: 'string' }
  },
  required: ['chatGroupId']
})

export class GetGroupChatService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      message: MessageModel,
      user: UserModel,
      reportedUser: ReportedUserModel,
      currency: CurrencyModel
    } = this.context.sequelize.models

    try {
      const { page, perPage, search, toDate, fromDate, chatGroupId, userId } = this.args

      const user = await UserModel.findByPk(userId, { attributes: ['chatSettings'] })
      if (!user) return this.addError('UserNotExistsErrorType')

      let whereCondition = {
        status: MESSAGE_STATUS.ACTIVE,
        chatGroupId: chatGroupId,
        isPrivate: false
      }
      if (fromDate || toDate) whereCondition.createdAt = alignDatabaseDateFilter(fromDate, toDate)
      if (search) whereCondition.message = { [Op.iLike]: `%${search}%` }

      // get all attributes
      const userAttributes = [
        [Sequelize.literal(`CASE WHEN "message"."is_contain_offensive_word" = true THEN '${DELETED_MESSAGE}' ELSE "message"."message" END`), 'message'],
        ['actionee_id', 'userId'],
        'recipientId',
        ['id', 'messageId'],
        ['message_binary', 'gif'],
        'isContainOffensiveWord',
        ['message_type', 'messageType'],
        'createdAt',
        ['currency_id', 'currencyId'],
        ['more_details', 'moreDetails']
      ]

      const replyMessageAttributes = [
        [Sequelize.literal(`CASE WHEN "replyMessage"."is_contain_offensive_word" = true THEN '${DELETED_MESSAGE}' ELSE "replyMessage"."message" END`), 'message'],
        ['actionee_id', 'userId'],
        'recipientId',
        ['id', 'messageId'],
        ['message_binary', 'gif'],
        'isContainOffensiveWord',
        ['message_type', 'messageType'],
        'createdAt',
        ['currency_id', 'currencyId'],
        ['more_details', 'moreDetails']
      ]

      if (userId) {
        const blockedUsers = await ReportedUserModel.findAll({
          attributes: ['reportedUserId'],
          where: { groupId: chatGroupId, actioneeId: userId, isUnblocked: false }
        })
        if (blockedUsers.length) {
          const blockedPlayers = blockedUsers.map(player => +player.reportedUserId)
          whereCondition.actioneeId = { [Op.notIn]: blockedPlayers }
        }

        if (user.userSettings?.displayGIF === 'false') whereCondition = { ...whereCondition, messageType: { [Op.not]: MESSAGE_TYPE.GIF } }
      }

      const chatDetails = await MessageModel.findAndCountAll({
        where: whereCondition,
        subQuery: false,
        attributes: userAttributes,
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
            model: MessageModel,
            as: 'replyMessage',
            attributes: replyMessageAttributes,
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
                attributes: ['id', 'code', 'name', 'symbol']
              }
            ]
          },
          {
            model: CurrencyModel,
            attributes: ['id', 'code', 'name', 'symbol']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: perPage,
        offset: ((page - 1) * perPage),
        transaction: this.context.sequelizeTransaction
      })

      return { chatDetails: chatDetails.rows || [], page, totalPages: Math.ceil(chatDetails.count / perPage) }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
