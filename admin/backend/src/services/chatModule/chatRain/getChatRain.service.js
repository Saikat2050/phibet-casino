import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import ajv from '@src/libs/ajv'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string', transform: ['trim'] },
    page: { type: 'number', default: 1 },
    perPage: { type: 'number', default: 15 },
    status: { type: 'string' },
    fromDate: { type: 'string', format: 'date' },
    toDate: { type: 'string', format: 'date' }
  }
})

export default class GetChatRainUsersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { perPage, page, search, fromDate, toDate } = this.args
    const ChatRainModel = this.context.sequelize.models.chatRain

    try {
      const where = {}
      if (search) where.name = { [Op.iLike]: `%\\${search}%` }
      if (fromDate || toDate) { where.createdAt = alignDatabaseDateFilter(fromDate, toDate) }

      const { rows, count } = await ChatRainModel.findAndCountAll({
        where,
        order: [['id', 'desc']],
        limit: perPage,
        offset: ((page - 1) * perPage)
      })

      return { chatRains: rows, page, totalPages: Math.ceil(count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
