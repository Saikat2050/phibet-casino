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
  required: ['userId']
})
export default class GetUserMessageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const MessagesModel = this.context.sequelize.models.message
    const transaction = this.context.sequelizeTransaction
    const { perPage, page, userId, fromDate, toDate, searchMessage, chatGroupId } = this.args

    try {
      const where = { chatGroupId }
      if (userId) where.actioneeId = userId
      if (searchMessage) where.message = { [Op.iLike]: `%\\${searchMessage}%` }
      if (fromDate || toDate) where.createdAt = alignDatabaseDateFilter(fromDate, toDate)

      const { rows, count } = await MessagesModel.findAndCountAll({
        where,
        attributes: ['id', 'message', 'actioneeId', ['message_binary', 'gif'], 'messageType', 'status', 'isContainOffensiveWord', 'createdAt'],
        transaction,
        order: [['createdAt', 'DESC']],
        limit: perPage,
        offset: ((page - 1) * perPage)
      })

      return { records: rows, page, totalPages: Math.ceil(count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
