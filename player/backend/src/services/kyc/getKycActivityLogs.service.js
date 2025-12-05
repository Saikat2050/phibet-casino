import ServiceBase from '@src/libs/serviceBase'

export class GetKycActivityLogsService extends ServiceBase {
  async run () {
    const { userId, page = 1, limit = 20, action } = this.args
    const { sequelize } = this.context
    const { kycActivityLog } = sequelize.models
    try {
      const whereClause = { userId }
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
export default GetKycActivityLogsService;
