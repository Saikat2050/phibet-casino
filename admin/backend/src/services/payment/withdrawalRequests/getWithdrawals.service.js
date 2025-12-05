import { APIError } from '@src/errors/api.error'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { WITHDRAWAL_STATUS } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    fromDate: { type: 'string' },
    toDate: { type: 'string' },
    status: { enum: [...Object.values(WITHDRAWAL_STATUS), 'all'] },
    page: { type: 'number', default: 1, minimum: 1 },
    perPage: { type: 'number', default: 10, minimum: 10 },
    userId: { type: 'number' },
    searchString: { type: 'string' },
    tagId: { type: 'string' }
  },
  required: []
})

export class GetWithdrawalsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, perPage, toDate, fromDate, status, userId, searchString, tagId } = this.args
    const withdrawalModel = this.context.sequelize.models.withdrawal

    try {
      const where = {}
      const nestedInclude = []
      if (status && status !== 'all') where.status = status
      if (fromDate || toDate) where.createdAt = alignDatabaseDateFilter(fromDate, toDate)
      if (userId) where.userId = userId
      if (searchString) where.transactionId = { [Op.iLike]: `%${searchString}%` }
      if (tagId) {
        nestedInclude.push({
          model: this.context.sequelize.models.userTag,
          attributes: [],
          required: true,
          include: {
            model: this.context.sequelize.models.tag,
            attributes: [],
            required: true,
            where: { id: tagId, isActive: true }
          }
        })
      }

      const { rows, count } = await withdrawalModel.findAndCountAll({
        where,
        include: {
          model: this.context.sequelize.models.user,
          attributes: ['email'],
          required: true,
          include: nestedInclude
        },
        limit: perPage,
        order: [['createdAt', 'DESC']],
        offset: (page - 1) * perPage
      })

      return { transactions: rows, totalPages: Math.ceil(count / perPage), page }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
