import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'number' },
    userId: { type: ['number', 'null'] },
    action: { type: ['string', 'null'] },
    page: { type: 'number', minimum: 1 },
    limit: { type: 'number', minimum: 1, maximum: 100 }
  },
  required: ['adminUserId']
})

export class GetKycActivityLogsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, action, page = 1, limit = 20 } = this.args
    const { sequelize } = this.context
    const { kycActivityLog } = sequelize.models

    try {
      const whereClause = {}
      if (userId) whereClause.userId = userId
      if (action) whereClause.action = action

      const offset = (page - 1) * limit

      const logs = await kycActivityLog.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit,
        offset
      })

      const totalPages = Math.ceil(logs.count / limit)

      return {
        result: {
          logs: logs.rows,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: logs.count,
            itemsPerPage: limit
          }
        }
      }
    } catch (error) {
      return this.addError('GetKycActivityLogsError', error.message)
    }
  }
}

export default GetKycActivityLogsService
