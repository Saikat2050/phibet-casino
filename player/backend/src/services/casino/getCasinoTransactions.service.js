import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { dayjs } from '@src/libs/dayjs'
import { Logger } from '@src/libs/logger'
import ServiceBase from '@src/libs/serviceBase'
import { CURRENCY_TYPES, LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    purpose: { enum: Object.values(LEDGER_PURPOSE) },
    userId: { type: 'string' },
    coinType: { type: 'string' },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    page: { type: 'number', default: 1, minimum: 1 },
    perPage: { type: 'number' }
  },
  required: ['userId']
})

export class GetCasinoTransactionService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      perPage = 10,
      page = 1,
      endDate,
      startDate,
      purpose,
      userId,
      coinType
    } = this.args

    try {
      const conditions = []

      const nestedConditions = []

      const queryParams = []

      // Date range condition
      if (startDate || endDate) {
        const start = dayjs(startDate).startOf('day').format()

        const end = endDate ? dayjs(endDate).endOf('day').format() : dayjs().endOf('week').add(1, 'day').format()

        conditions.push(`ct.created_at BETWEEN '${start}' AND '${end}'`)
      }

      // conditions.push(`ct.user_id = ${userId} AND ${ coinType==='all' ? (cu.type = 'gold-coin' OR cu.type = 'sweep-coin') : cu.type = coinType} `)

      // User ID condition
      if (userId) {
        conditions.push(`ct.user_id = ${userId}`)
      }

      if (coinType) {
        conditions.push((coinType === 'all' || !coinType) ? '(cu.type = \'gold-coin\' OR cu.type = \'sweep-coin\')' : `cu.type = '${coinType}'`)
      }

      if (coinType) {
        conditions.push((coinType === 'all' || !coinType) ? '(cu.type = \'gold-coin\' OR cu.type = \'sweep-coin\')' : `cu.type = '${coinType}'`)
      }

      // Purpose condition
      if (purpose) {
        nestedConditions.push(`l.purpose = ${purpose}`)
      }

      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

      const nestedWhereClause = nestedConditions.length ? `AND ${nestedConditions.join(' AND ')}` : ''

      // Query to count total records
      const countQuery = `
        SELECT COUNT(*) AS totalCount
        FROM casino_transactions AS ct
        INNER JOIN ledgers AS l
        ON ct.id = l.transaction_id AND l.transaction_type = 'casino' ${nestedWhereClause}
        INNER JOIN casino_games ON ct.game_id = casino_games.id
        INNER JOIN currencies AS cu
        ON l.currency_id = cu.id
        ${whereClause};
      `

      const countResult = await this.context.sequelize.query(countQuery, {
        replacements: queryParams
      })

      const totalCount = countResult[0][0].totalcount

      // Main query for fetching data
      const query = `
        SELECT
          ct.user_id AS user_id,
          u.username AS username,
          ct.id as id,
          ct.status as status,
          l.purpose as purpose,
          ct.created_at created_at,
          l.to_wallet_id as to_wallet_id,
          l.from_wallet_id as from_wallet_id,
          cg.name,
          cg.unique_id,
          SUM(l.amount) FILTER (WHERE cu.type = '${CURRENCY_TYPES.GOLD_COIN}') AS GCAmount,
          SUM(l.amount) FILTER (WHERE cu.type = '${CURRENCY_TYPES.SWEEP_COIN}') AS SCAmount
        FROM
          casino_transactions AS ct
        INNER JOIN
          ledgers AS l
          ON ct.id = l.transaction_id AND l.transaction_type = 'casino' ${nestedWhereClause}
        INNER JOIN
          casino_games as cg
          ON ct.game_id = cg.id
        INNER JOIN
          users AS u
          ON ct.user_id = u.id
        INNER JOIN
        currencies AS cu
        ON l.currency_id = cu.id
        ${whereClause}
        GROUP BY
          ct.user_id, ct.id, u.username, cg.name,  cg.unique_id, l.purpose, ct.created_at, l.to_wallet_id, l.from_wallet_id
        ORDER BY
          ct.created_at DESC
        LIMIT ? OFFSET ?
        ;
      `

      // Push limit and offset for pagination
      queryParams.push(perPage, (page - 1) * perPage)

      const casinoTransaction = await this.context.sequelize.query(query, {
        replacements: queryParams
      })

      return { casinoTransaction: casinoTransaction[0], totalPages: Math.ceil(totalCount / perPage), page }
    } catch (error) {
      Logger.error(`Error fetching casino transactions: - ${error}`)

      throw new APIError('An error occurred while fetching transactions', error)
    }
  }
}
