import { ServiceBase } from '@src/libs/serviceBase'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'
import { Op } from 'sequelize'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    searchMessage: { type: 'string', transform: ['trim'] },
    page: { type: 'number', default: 1 },
    perPage: { type: 'number', default: 15 },
    chatGroupId: { type: 'string' },
    fromDate: { type: 'string', format: 'date' },
    toDate: { type: 'string', format: 'date' },
    userId: { type: 'string' }
  },
  required: ['chatGroupId']
})

export default class GetGroupMessageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const MessagesModel = this.context.sequelize.models.message
    const ChatGroupModel = this.context.sequelize.models.chatGroup
    const UserModel = this.context.sequelize.models.user
    const { perPage, page, chatGroupId, userId, fromDate, toDate, searchMessage } = this.args

    try {
      let query = { chatGroupId }
      if (userId) query = { ...query, actionee_id: userId }
      if (searchMessage) query = { ...query, message: { [Op.iLike]: `%\\${searchMessage}%` } }
      if (fromDate || toDate) query.createdAt = alignDatabaseDateFilter(fromDate, toDate)

      const records = await MessagesModel.findAndCountAll({
        where: { ...query },
        attributes: ['id', 'message', 'actioneeId', ['message_binary', 'gif'], 'messageType', 'status', 'isContainOffensiveWord', 'sharedEvent', 'createdAt'],
        include: [{
          model: UserModel,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'imageUrl']
        }, {
          model: UserModel,
          as: 'recipientUser',
          attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'imageUrl']
        }, {
          model: MessagesModel,
          as: 'replyMessage',
          attributes: ['id', 'message', 'actioneeId', ['message_binary', 'gif'], 'messageType', 'status', 'isContainOffensiveWord', 'sharedEvent', 'createdAt'],
          include: {
            model: UserModel,
            as: 'user',
            attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'imageUrl']
          }
        }],
        order: [['createdAt', 'DESC']],
        limit: perPage,
        offset: ((page - 1) * perPage)
      })

      const group = await ChatGroupModel.findOne({
        where: { id: chatGroupId },
        attributes: ['id', 'name', 'description', 'groupLogo']
      })

      if (!group || records.count < 1) {
        return this.addError('ChatGroupNotFoundErrorType')
      }

      return { group, records: records.rows, page, totalPages: Math.ceil(records.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
