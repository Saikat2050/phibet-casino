import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { dayjs } from '@src/libs/dayjs'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { ServiceBase } from '@src/libs/serviceBase'
import { getReportDates } from '@src/utils/common'
import { REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { LEDGER_TRANSACTION_TYPE, LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'

const TAB_OPTIONS = {
  GAME: 'game',
  PROVIDER: 'provider'
}

const constraints = ajv.compile({
  type: 'object',
  properties: {
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    gameName: { type: 'string' },
    csvDownload: { type: 'boolean' },
    currencyId: { type: 'string' },
    tab: { enum: Object.values(TAB_OPTIONS), default: TAB_OPTIONS.GAME },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 2, maximum: 500, default: 5 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['totalBetAmount', 'totalWinAmount', 'totalPlayers', 'id'], default: 'totalBetAmount' }
  },
  required: ['tab']
})

export class GetGameReportService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { tab, dateOptions, currencyId, page, perPage, order, orderBy, gameName } = this.args
      const { fromDate, toDate } = getReportDates(
        dateOptions,
        this.args.fromDate || dayjs().startOf('day'),
        this.args.toDate || dayjs().endOf('day')
      )

      // Constructing SQL query parts
      const selectClause = `
        SELECT
          SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_BET}' THEN ledger.amount ELSE 0 END) AS "totalBetAmount",
          SUM(CASE WHEN ledger.purpose IN ('${LEDGER_PURPOSE.CASINO_REFUND}', '${LEDGER_PURPOSE.CASINO_WIN}') THEN ledger.amount ELSE 0 END) AS "totalWinAmount",
          COUNT(DISTINCT casinoTransaction.user_id) AS "totalPlayers",
          ${tab === TAB_OPTIONS.PROVIDER ? 'casinoProvider.id AS id, casinoProvider.name#>>\'{EN}\' AS name' : 'casinoGame.id AS id, casinoGame.name#>>\'{EN}\' AS name'}
      `

      let fromClause = `
        FROM public.casino_transactions AS casinoTransaction
        INNER JOIN public.ledgers AS ledger
          ON casinoTransaction.id = ledger.transaction_id AND ledger.transaction_type = '${LEDGER_TRANSACTION_TYPE.CASINO}'
        INNER JOIN public.casino_games AS casinoGame
          ON casinoTransaction.game_id = casinoGame.id
      `

      // Joining providers if needed
      if (tab === TAB_OPTIONS.PROVIDER) {
        fromClause += `
          INNER JOIN public.casino_providers AS casinoProvider
            ON casinoGame.casino_provider_id = casinoProvider.id
        `
      }

      let whereClause = `
        WHERE casinoTransaction.created_at BETWEEN '${fromDate}' AND '${toDate}'
        AND ledger.purpose IN ('${LEDGER_PURPOSE.CASINO_BET}', '${LEDGER_PURPOSE.CASINO_WIN}', '${LEDGER_PURPOSE.CASINO_REFUND}')
        ${currencyId ? `AND ledger.currency_id = ${currencyId}` : 'AND ledger.currency_id != 1'}
      `

      // Filter by game name if required
      if (tab === TAB_OPTIONS.GAME && gameName) {
        whereClause += ` AND casinoGame.name#>>'{EN}' ILIKE '%${gameName}%'`
      }

      const groupByClause = `GROUP BY ${tab === TAB_OPTIONS.PROVIDER ? 'casinoProvider.id' : 'casinoGame.id'}`
      const orderByClause = `ORDER BY "${orderBy}" ${order}`
      const paginationClause = `LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`

      // Final query
      const query = `${selectClause} ${fromClause} ${whereClause} ${groupByClause} ${orderByClause} ${paginationClause}`

      const [data] = await this.context.sequelize.query(query, { logging: false })
      const reportData = data.rows || data

      // Process report data
      const gameReport = reportData.map(item => ({
        ...item,
        totalBetAmount: NumberPrecision.round(item.totalBetAmount),
        totalWinAmount: NumberPrecision.round(item.totalWinAmount),
        gameRevenue: NumberPrecision.minus(item.totalBetAmount, item.totalWinAmount),
        payout: NumberPrecision.times(NumberPrecision.divide(item.totalWinAmount, item.totalBetAmount), 100)
      }))

      // Calculate total pages and aggregated numbers
      let totalPages, aggregatedNumbers
      if (page) {
        const countQuery = `
          SELECT COUNT(DISTINCT ${tab === TAB_OPTIONS.PROVIDER ? 'casinoProvider.id' : 'casinoGame.id'}) AS "totalCount",
            SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_BET}' THEN ledger.amount ELSE 0 END) AS "totalBetAmount",
            SUM(CASE WHEN ledger.purpose IN ('${LEDGER_PURPOSE.CASINO_REFUND}', '${LEDGER_PURPOSE.CASINO_WIN}') THEN ledger.amount ELSE 0 END) AS "totalWinAmount"
          ${fromClause} ${whereClause}
        `
        const [countResult] = await this.context.sequelize.query(countQuery)
        aggregatedNumbers = countResult[0]
        totalPages = Math.ceil(aggregatedNumbers.totalCount / perPage)
        delete aggregatedNumbers.totalCount
      }

      return { ...aggregatedNumbers, totalPages, page, gameReport }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
