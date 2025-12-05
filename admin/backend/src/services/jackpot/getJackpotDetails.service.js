import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import { sequelize } from '@src/database/models'
import { JACKPOT_STATUS } from '@src/utils/constants/app.constants'
import { Op } from 'sequelize'

export class GetAllJackpotDetailService extends ServiceBase {
  async run () {
    const { jackpotId, status, search, pageNo, limit, sort, orderBy } = this.args

    try {
      if (jackpotId) {
        const [jackpot] = await sequelize.query(`
        SELECT
          j.jackpot_id AS "jackpotId",
          j.jackpot_name AS "jackpotName",
          j.max_ticket_size AS "maxTicketSize",
          j.status AS "status",
          j.seed_amount AS "seedAmount",
          j.jackpot_pool_amount AS "jackpotPoolAmount",
          j.jackpot_pool_earning AS "jackpotPoolEarning",
          j.entry_amount AS "entryAmount",
          j.admin_share AS "adminShare",
          j.pool_share AS "poolShare",
          j.winning_ticket AS "winningTicket",
          j.start_date AS "startDate",
          j.end_date AS "winningDate",
          j.ticket_sold AS "ticketSold",
          j.winning_ticket AS "winningTicket",
          users.id AS "userId",
          users.email AS "email",
          users.username AS "username",
          j.game_id AS "gameId",
          (SELECT name FROM casino_games WHERE id = j.game_id ) AS "gameName"
        FROM
          JACKPOTS j
          LEFT JOIN USERS ON USERS.ID = J.USER_ID
        WHERE
          j.jackpot_id = :jackpotId AND j.DELETED_AT IS NULL`, { type: sequelize.QueryTypes.SELECT, replacements: { jackpotId } })

        return {
          success: true,
          data: jackpot
        }
      }
      let query = ''
      const whereClause = {}
      if (status) {
        query += `AND JACKPOTS.STATUS = '${JACKPOT_STATUS[status.toUpperCase()]}'`
        whereClause.status = JACKPOT_STATUS[status.toUpperCase()]
      }
      if (search) {
        query += `AND JACKPOTS.JACKPOT_NAME iLIKE '%${search}%'`
        whereClause.jackpotName = { [Op.iLike]: `%${search}%` }
      }

      let orderClause = 'JACKPOTS.UPDATED_AT DESC'
      if (orderBy && sort) {
        switch (orderBy) {
          case 'userId':
            orderClause = 'USERS.ID ' + sort
            break
          case 'email':
            orderClause = 'USERS.EMAIL ' + sort
            break
          case 'username':
            orderClause = 'USERS.USERNAME ' + sort
            break
          case 'poolAmount':
            orderClause = 'JACKPOTS.JACKPOT_POOL_AMOUNT ' + sort
            break
          case 'netRevenue':
            orderClause = 'ROUND((JACKPOTS.JACKPOT_POOL_EARNING - JACKPOTS.SEED_AMOUNT)::numeric, 2) ' + sort
            break
          default:
            orderClause = `JACKPOTS.${this.camelCaseToSnakeCase(orderBy)}` + ' ' + sort
        }
      }

      const page = Number(pageNo) > 0 ? Number(pageNo) : 1
      const size = Number(limit) > 0 ? Number(limit) : 10

      const [count, jackpots] = await Promise.all([
        this.context.sequelize.models.jackpot.count({ where: whereClause }),
        sequelize.query(`
        SELECT
          JACKPOTS.JACKPOT_ID AS "jackpotId",
          JACKPOTS.JACKPOT_NAME AS "jackpotName",
          JACKPOTS.JACKPOT_POOL_EARNING AS "jackpotPoolEarning",
          USERS.ID AS "userId",
          USERS.EMAIL AS "email",
          JACKPOTS.SEED_AMOUNT AS "seedAmount",
          USERS.USERNAME AS "username",
          JACKPOTS.JACKPOT_POOL_AMOUNT AS "poolAmount",
          JACKPOTS.GAME_ID AS "gameId",
          JACKPOTS.STATUS AS "status",
          (SELECT NAME FROM CASINO_GAMES WHERE ID = JACKPOTS.GAME_ID) AS "gameName",
          JACKPOTS.END_DATE AS "winningDate",
          JACKPOTS.TICKET_SOLD AS "ticketSold",
          JACKPOTS.WINNING_TICKET AS "winningTicket",
          ROUND((JACKPOTS.JACKPOT_POOL_EARNING - JACKPOTS.SEED_AMOUNT)::numeric, 2) AS "netRevenue"
        FROM
          JACKPOTS
        LEFT JOIN USERS ON USERS.ID = JACKPOTS.USER_ID
        WHERE
          JACKPOTS.DELETED_AT IS NULL ${query}
        ORDER BY
          ${orderClause}
        LIMIT ${size} OFFSET ${(page - 1) * size};`, {
          type: sequelize.QueryTypes.SELECT,
          raw: true
        })
      ])

      return {
        success: true,
        data: {
          rows: jackpots,
          page,
          totalPages: Math.ceil(count / size),
          totalRecords: count
        }
      }
    } catch (error) {
      throw new APIError(error)
    }
  }

  camelCaseToSnakeCase (str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).toUpperCase()
  }
}
