import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { dayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { getPastDatesForDeltaCalculations, getReportDates } from '@src/utils/common'
import { REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    currencyId: { type: 'string' },
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM }
  }
})

export class GetMatricsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { toDate: customToDate, fromDate: customFromDate, dateOptions } = this.args

    try {
      const { fromDate, toDate } = getReportDates(dateOptions, customFromDate || dayjs().subtract(3, 'month'), customToDate || dayjs().endOf('day'))
      const { pastFromDate, pastToDate } = getPastDatesForDeltaCalculations(fromDate, toDate)

      const [playerMetrics, userMetrics, coinMatrics] = await Promise.all([
        this.context.sequelize.query(`
          SELECT
            COUNT(*) AS "totalPlayers",
            COUNT(CASE WHEN logged_in = true THEN 1 ELSE NULL END) AS "loggedInPlayers"
          FROM users
        `),
        this.context.sequelize.query(`
            SELECT
              COUNT(*) FILTER (WHERE u.created_at >= '${fromDate}' AND u.created_at <= '${toDate}') AS "registeredUsers",
              COUNT(*) FILTER (WHERE u.created_at >= '${pastFromDate}' AND u.created_at <= '${pastToDate}') AS "pastRegisteredUsers",

              COUNT(DISTINCT t.user_id) FILTER (WHERE u.created_at >= '${fromDate}' AND u.created_at <= '${toDate}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE}') AS "usersWithPurchase",
              COUNT(DISTINCT t.user_id) FILTER (WHERE u.created_at >= '${pastFromDate}' AND u.created_at <= '${pastToDate}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE}') AS "usersWithPurchaseInPast",

              COUNT(DISTINCT t.user_id) FILTER (WHERE u.created_at >= '${fromDate}' AND u.created_at <= '${toDate}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE}' AND repeat_purchasers.repeat_count > 1) AS "repeatPurchasers",
              COUNT(DISTINCT t.user_id) FILTER (WHERE u.created_at >= '${pastFromDate}' AND u.created_at <= '${pastToDate}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE}' AND repeat_purchasers.repeat_count > 1) AS "repeatPurchasersInPast"
            FROM users u
            LEFT JOIN transactions t ON t.user_id = u.id
            LEFT JOIN ledgers l ON t.id = l.transaction_id AND l.transaction_type = 'standard'
            LEFT JOIN (
              SELECT user_id, COUNT(*) AS repeat_count
              FROM transactions
              GROUP BY user_id
            ) AS repeat_purchasers ON repeat_purchasers.user_id = t.user_id
        `),
        this.context.sequelize.query(`
            SELECT
              currency_id,
              SUM(CASE WHEN purpose = '${LEDGER_PURPOSE.PURCHASE}' THEN amount ELSE 0 END) AS "totalPurchased",
              SUM(CASE WHEN purpose = '${LEDGER_PURPOSE.REDEEM}' THEN amount ELSE 0 END) AS "totalRedeemed",
              SUM(CASE WHEN purpose = '${LEDGER_PURPOSE.CASINO_BET}' THEN amount ELSE 0 END) AS "totatPlayed",
              SUM(CASE WHEN purpose IN ('${LEDGER_PURPOSE.CASINO_WIN}', '${LEDGER_PURPOSE.CASINO_REFUND}') THEN amount ELSE 0 END) AS "totalWon"
            FROM
              ledgers
            WHERE
              purpose IN ('${LEDGER_PURPOSE.REDEEM}', '${LEDGER_PURPOSE.CASINO_BET}', '${LEDGER_PURPOSE.CASINO_WIN}', '${LEDGER_PURPOSE.CASINO_REFUND}', '${LEDGER_PURPOSE.PURCHASE}')
              AND created_at BETWEEN '${fromDate}' AND '${toDate}'
            GROUP BY
              currency_id;
          `)
      ])

      const playerMetricsData = playerMetrics[0][0]
      const userMetricsData = userMetrics[0][0]
      const coinMetricsData = coinMatrics[0]

      return {
        totalPlayers: +playerMetricsData.totalPlayers,
        loggedInPlayers: +playerMetricsData.loggedInPlayers,
        userMetricsData,
        coinMetricsData
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}

// SELECT
// CASE WHEN registeredUsers = 0 THEN 0 ELSE ROUND(usersWithDepositToday::numeric / registeredUsers::numeric, 2) * 100 END AS presentPurchaseConversionRate,
// CASE WHEN pastRegisteredUsers = 0 THEN 0 ELSE ROUND(usersWithDepositPast::numeric / pastRegisteredUsers::numeric, 2) * 100 END AS pastPurchaseConversionRate,

// CASE WHEN usersWithDepositToday = 0 THEN 0 ELSE ROUND(repeatPurchasersToday::numeric / usersWithDepositToday::numeric, 2) * 100 END AS presentRepeatPurchaseConversionRate,
// CASE WHEN usersWithDepositPast = 0 THEN 0 ELSE ROUND(repeatPurchasersPast::numeric / usersWithDepositPast::numeric, 2) * 100 END AS pastRepeatPurchaseConversionRate,

// registeredUsers,
// pastRegisteredUsers
// FROM combined_counts
