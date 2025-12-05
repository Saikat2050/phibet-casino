import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { QUERY_STATUS } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', default: 1 },
    perPage: { type: 'number', default: 10 },
    status: { enum: Object.values(QUERY_STATUS) },
    userId: { type: 'string' }
  }
})

export class GetUserDisputesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { page, perPage, status, userId } = this.args
      const offset = (page - 1) * perPage // Calculate offset
      const replacements = {
        limit: perPage,
        offset: offset,
        userId: userId
      }
      let query = `
          SELECT mt.*,
                COUNT(tm.id) AS unread_message_count
          FROM main_threads mt
          LEFT JOIN thread_messages tm ON mt.id = tm.thread_id AND tm.user_read = false WHERE mt.user_id = :userId `
      let countQuery = 'SELECT COUNT(*) FROM main_threads WHERE user_id = :userId '
      const countReplacement = { replacements: { userId: userId } }
      if (status) {
        query += 'AND mt.status = :status'
        replacements.status = status
        countQuery += 'AND status = :status'
        countReplacement.replacements.status = status
      }
      query += `
      GROUP BY mt.id
      ORDER BY mt.created_at DESC
      LIMIT :limit OFFSET :offset;
      `
      const threadTickets = await this.context.sequelize.query(query, {
        replacements: replacements,
        type: this.context.sequelize.QueryTypes.SELECT
      })
      countReplacement.type = this.context.sequelize.QueryTypes.SELECT
      const [{ count: ticketsCount }] = await this.context.sequelize.query(countQuery, countReplacement)
      return { threadTickets: threadTickets, page, totalPages: Math.ceil(ticketsCount / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
