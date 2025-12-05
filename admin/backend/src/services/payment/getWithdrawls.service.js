import { APIError } from '@src/errors/api.error'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { WITHDRAWAL_STATUS } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    status: { enum: Object.values(WITHDRAWAL_STATUS) },
    page: { type: 'number', default: 1, minimum: 1 },
    perPage: { type: 'number', default: 10, minimum: 10 }
  },
  required: []
})

export class GetWithdrawalsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, perPage, endDate, startDate, status } = this.args
    const withdrawalModel = this.context.sequelize.models.withdrawal

    try {
      const where = {}
      if (status) where.status = status
      if (startDate || endDate) where.createdAt = alignDatabaseDateFilter(startDate, endDate)

      const { rows, count } = await withdrawalModel.findAndCountAll({
        where,
        perPage,
        order: [['createdAt', 'DESC']],
        offset: (page - 1) * perPage
      })

      return { transactions: rows, totalPages: Math.ceil(count / perPage), page }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
