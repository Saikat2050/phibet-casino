import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { dayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { getReportDates } from '@src/utils/common'
import { REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    csvDownload: { type: 'boolean', default: false },
    currencyId: { type: 'string', default: '1' },
    searchString: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 5, maximum: 500, default: 5 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    userId: { type: 'string' },
    orderBy: {
      enum: ['gcStakedAmount', 'gcBetCount', 'scStakedAmount', 'scBetCount', 'scCasinoWins', 'gcCasinoWins', 'gcPurchases', 'scRewards', 'redeemAmount', 'purchaseCount', 'netProfit'
      ],
      default: 'netProfit'
    },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM }
  },
  required: []
})

export class GetPlayerPerformanceReportService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { currencyId, searchString, csvDownload, dateOptions, fromDate, toDate, perPage, page, orderBy, order, userId } = this.args
    const filters = []
    const replacements = { currencyId }

    if (userId) {
      filters.push('u.id = :userId')
      replacements.userId = userId
    }

    try {
      if (!csvDownload) {
        const { fromDate: calculatedFromDate, toDate: calculatedToDate } = getReportDates(dateOptions, fromDate || dayjs().startOf('month'), toDate || dayjs().endOf('day'))
        filters.push('l.created_at BETWEEN :fromDate AND :toDate')
        Object.assign(replacements, { fromDate: calculatedFromDate, toDate: calculatedToDate })
      }

      if (searchString) {
        filters.push('(u.email LIKE :searchString OR u.username LIKE :searchString)')
        replacements.searchString = `%${searchString}%`
      }

      const dateFilter = filters.join(' AND ')

      const baseQuery = `
        WITH playerStatistics AS (
          SELECT
            u.username AS username,
            u.id AS userId,
            ROUND(SUM(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id = 1 THEN l.amount
                ELSE 0
            END)::numeric, 2) AS "gcStakedAmount",
            COUNT(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id = 1 THEN l.id
                ELSE NULL
            END) AS "gcBetCount",
            ROUND(SUM(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id != 1 THEN l.amount
                ELSE 0
            END)::numeric, 2) AS "scStakedAmount",
            COUNT(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id != 1 THEN l.id
                ELSE NULL
            END) AS "scBetCount",
            ROUND(SUM(CASE
                WHEN l.purpose IN ('${LEDGER_PURPOSE.CASINO_WIN}', '${LEDGER_PURPOSE.CASINO_REFUND}') AND l.currency_id != 1 THEN l.amount
                ELSE 0
            END)::numeric, 2) AS "scCasinoWins",
            ROUND(SUM(CASE
                WHEN l.purpose IN ('${LEDGER_PURPOSE.CASINO_WIN}', '${LEDGER_PURPOSE.CASINO_REFUND}') AND l.currency_id = 1 THEN l.amount
                ELSE 0
            END)::numeric, 2) AS "gcCasinoWins",
            ROUND(SUM(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.PURCHASE}' AND l.currency_id != 1 THEN l.amount
                ELSE 0
            END)::numeric, 2) AS "gcPurchases",
            ROUND(SUM(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.PURCHASE}' AND l.currency_id = 1 THEN l.amount
                ELSE 0
            END)::numeric, 2) AS "scRewards",
            ROUND(SUM(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.REDEEM}' THEN l.amount
                ELSE 0
            END)::numeric, 2) AS "redeemAmount",
            COUNT(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.PURCHASE}' THEN l.id
                ELSE NULL
            END) AS "purchaseCount",
            ROUND((
              SUM(CASE
                  WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id != 1 THEN l.amount
                  ELSE 0
              END) -
              SUM(CASE
                  WHEN l.purpose IN ('${LEDGER_PURPOSE.CASINO_WIN}', '${LEDGER_PURPOSE.CASINO_REFUND}') AND l.currency_id != 1 THEN l.amount
                  ELSE 0
              END)
            )::numeric, 2) AS "netProfit"
          FROM
            ledgers AS l
            JOIN wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
            JOIN users AS u ON w.user_id = u.id
          WHERE ${dateFilter}
          GROUP BY u.id, u.username
        )
      `

      const selectQuery = `
        ${baseQuery}
        SELECT
          username,
          userId,
          "gcStakedAmount",
          "gcBetCount",
          "scStakedAmount",
          "scBetCount",
          "scCasinoWins",
          "gcCasinoWins",
          "gcPurchases",
          "scRewards",
          "redeemAmount",
          "purchaseCount",
          "netProfit"
        FROM playerStatistics
        ORDER BY "${orderBy}" ${order}
        LIMIT :perPage
        OFFSET :offset;
      `

      const countQuery = `
        ${baseQuery}
        SELECT COUNT(*) AS count
        FROM playerStatistics;
      `

      const replacementsWithPagination = { ...replacements, perPage, offset: (page - 1) * perPage }
      const reportData = await this.context.sequelize.query(selectQuery, { replacements: replacementsWithPagination, type: this.context.sequelize.QueryTypes.SELECT })
      const [{ count: totalCount }] = await this.context.sequelize.query(countQuery, { replacements, type: this.context.sequelize.QueryTypes.SELECT })

      return { totalPages: Math.ceil(totalCount / perPage), page, reportData }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
