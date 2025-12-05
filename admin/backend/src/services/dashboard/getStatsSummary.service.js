import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import { serverDayjs } from '@src/libs/dayjs'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { ServiceBase } from '@src/libs/serviceBase'
import { getReportDates } from '@src/utils/common'
import { CACHE_KEYS, CACHE_STORE_PREFIXES, REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    currencyId: { type: 'string' },
    toDate: { type: 'string', default: serverDayjs().startOf('day') },
    fromDate: { type: 'string', default: serverDayjs().subtract(90, 'day') },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM }
  }
})

export class GetStatsSummaryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { currencyId, dateOptions, fromDate: inputFromDate, toDate: inputToDate } = this.args
      const { fromDate, toDate } = getReportDates(dateOptions, inputFromDate, inputToDate)

      // Define the queries
      const query = `
        WITH user_totals AS (
            SELECT
              DATE_TRUNC('day', l.created_at) AS date,  -- Extracting date
              u.id AS userId,
              u.username AS username,

              -- Count of distinct transaction IDs
              COUNT(DISTINCT l.transaction_id) FILTER (WHERE l.purpose IN (:depositPurposes)) AS purchase_count,
              COUNT(DISTINCT l.transaction_id) FILTER (WHERE l.purpose = :withdrawPurpose) AS redeem_count,

              -- Purchase and Redeem Amounts
              SUM(CASE WHEN l.currency_id = 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose IN (:depositPurposes)) AS gc_purchase_amount,
              SUM(CASE WHEN l.currency_id != 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose IN (:depositPurposes)) AS sc_purchase_amount,
              SUM(CASE WHEN l.currency_id = 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose = :withdrawPurpose) AS gc_redeem_amount,
              SUM(CASE WHEN l.currency_id != 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose = :withdrawPurpose) AS sc_redeem_amount,
              SUM(CASE WHEN l.currency_id = 2 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose = :depositPurposes) AS sc_rewarded_amount,

              -- Distinct transaction_id for Casino Bet Counts
              SUM(CASE WHEN l.currency_id = 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose = :casinoBetPurpose) AS gc_casino_bet_amount,
              COUNT(DISTINCT l.transaction_id) FILTER (WHERE l.purpose = :casinoBetPurpose AND l.currency_id = 1) AS gc_bet_count,
              SUM(CASE WHEN l.currency_id != 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose = :casinoBetPurpose) AS sc_casino_bet_amount,
              COUNT(DISTINCT l.transaction_id) FILTER (WHERE l.purpose = :casinoBetPurpose AND l.currency_id != 1) AS sc_bet_count,

              -- Casino Win
              SUM(CASE WHEN l.currency_id = 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose IN (:casinoWinPurposes)) AS gc_casino_win_amount,
              SUM(CASE WHEN l.currency_id != 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose IN (:casinoWinPurposes)) AS sc_casino_win_amount,

              -- Calculate Net Profit
              ROUND((
                SUM(CASE WHEN l.currency_id = 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose = :casinoBetPurpose) -
                SUM(CASE WHEN l.currency_id = 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose IN (:casinoWinPurposes))
              )::numeric, 2) AS gc_net_profit,

              ROUND((
                SUM(CASE WHEN l.currency_id != 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose = :casinoBetPurpose) -
                SUM(CASE WHEN l.currency_id != 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose IN (:casinoWinPurposes))
              )::numeric, 2) AS sc_net_profit

            FROM
              "public"."ledgers" AS l
            JOIN
              wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
            JOIN
    users AS u ON w.user_id = u.id
           WHERE
             l.purpose IN (:allPurposes) AND l.created_at >= :toDate
           GROUP BY
             DATE_TRUNC('day', l.created_at), u.id, u.username
         )
         SELECT
           date,
           userId,
           username,
           purchase_count,
           redeem_count,

           -- Purchase and Redeem Amounts
           ROUND(gc_purchase_amount::numeric, 2) AS gc_purchase_amount,
           ROUND(sc_purchase_amount::numeric, 2) AS sc_purchase_amount,
           ROUND(gc_redeem_amount::numeric, 2) AS gc_redeem_amount,
           ROUND(sc_redeem_amount::numeric, 2) AS sc_redeem_amount,
           ROUND(sc_rewarded_amount::numeric, 2) AS sc_rewarded_amount,


           -- Bet Count and Amount
           ROUND(gc_casino_bet_amount::numeric, 2) AS gc_casino_bet_amount,
           gc_bet_count AS gc_bet_count,
           ROUND(sc_casino_bet_amount::numeric, 2) AS sc_casino_bet_amount,
           sc_bet_count AS sc_bet_count,

           -- Win Amounts
           ROUND(gc_casino_win_amount::numeric, 2) AS gc_casino_win_amount,
           ROUND(sc_casino_win_amount::numeric, 2) AS sc_casino_win_amount,

           -- Net Profit
           gc_net_profit,
           sc_net_profit

         FROM
           user_totals
         ORDER BY
  date ASC;
      `
      const overAllGgrQuery = `
  WITH aggregated_totals AS (
    SELECT
      SUM(gc_total_redeem_amount) AS gc_total_redeem_amount,
      SUM(gc_total_casino_bet_amount) AS gc_total_casino_bet_amount,
      SUM(gc_total_casino_win_amount) AS gc_total_casino_win_amount,

      SUM(sc_total_redeem_amount) AS sc_total_redeem_amount,
      SUM(sc_total_purchase_amount) AS sc_total_purchase_amount,
      SUM(sc_total_casino_bet_amount) AS sc_total_casino_bet_amount,
      SUM(sc_total_casino_win_amount) AS sc_total_casino_win_amount
    FROM
      daily_statistical_summary
  )
  SELECT
    gc_total_redeem_amount,
    gc_total_casino_bet_amount,
    gc_total_casino_win_amount,

    sc_total_purchase_amount,
    sc_total_redeem_amount,
    sc_total_casino_bet_amount,
    sc_total_casino_win_amount
  FROM
    aggregated_totals;
`

      // Execute concurrent queries

      const [historicalData, newRegistrations, result, playerRegisteredToday, loggedInUsers, totalGames, totalProviders, playerCount, overAllGgr] = await Promise.all([
        this.context.sequelize.query('SELECT * FROM daily_statistical_summary WHERE date BETWEEN :fromDate AND :toDate ORDER BY date ASC', {
          replacements: { fromDate, toDate },
          type: this.context.sequelize.QueryTypes.SELECT
        }),
        this.context.sequelize.query(`
          WITH user_counts AS (
            SELECT COUNT(*) AS total_users_registered_today
            FROM users
            WHERE created_at BETWEEN :fromDate AND :toDate
          ),
          deposit_counts AS (
            SELECT COUNT(*) AS deposit_count
            FROM (
              SELECT MIN(t.id) AS min_transaction_id
              FROM transactions AS t
              JOIN users AS u ON t.user_id = u.id
              LEFT JOIN ledgers AS l ON l.transaction_id = t.id AND transaction_type = 'standard'
              WHERE u.created_at BETWEEN :fromDate AND :toDate
                AND l.purpose = '${LEDGER_PURPOSE.PURCHASE}'
              GROUP BY t.user_id
            ) AS subquery
          )
          SELECT
            CASE
              WHEN deposit_count = 0 THEN 0
              ELSE ROUND(deposit_count::numeric / total_users_registered_today::numeric, 2) * 100
            END AS deposit_conv_rate,
            total_users_registered_today
          FROM deposit_counts, user_counts;
        `, {
          replacements: { fromDate, toDate },
          type: this.context.sequelize.QueryTypes.SELECT
        }),
        this.context.sequelize.query(query, {
          replacements: {
            depositPurposes: LEDGER_PURPOSE.PURCHASE,
            withdrawPurpose: LEDGER_PURPOSE.REDEEM,
            casinoBetPurpose: LEDGER_PURPOSE.CASINO_BET,
            casinoWinPurposes: [LEDGER_PURPOSE.CASINO_WIN, LEDGER_PURPOSE.CASINO_REFUND],
            allPurposes: [
              LEDGER_PURPOSE.PURCHASE,
              LEDGER_PURPOSE.REDEEM,
              LEDGER_PURPOSE.CASINO_BET,
              LEDGER_PURPOSE.CASINO_WIN,
              LEDGER_PURPOSE.CASINO_REFUND,
              LEDGER_PURPOSE.REFERRAL_DEPOSIT
            ],
            toDate: serverDayjs().startOf('day').format(),
            currencyId
          },
          logging: false,
          type: this.context.sequelize.QueryTypes.SELECT
        }),
        this.context.sequelize.query('SELECT COUNT(*) FROM users WHERE created_at >= :todayStart', {
          replacements: { todayStart: serverDayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss') },
          type: this.context.sequelize.QueryTypes.SELECT
        }),
        Cache.keys(CACHE_STORE_PREFIXES.SESSION),
        Cache.get(CACHE_KEYS.GAME_COUNT),
        Cache.get(CACHE_KEYS.PROVIDER_COUNT),
        Cache.get(CACHE_KEYS.PLAYER_COUNT),
        this.context.sequelize.query(overAllGgrQuery, {
          replacements: { todayStart: serverDayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss') }
        })
      ])
      // Merge historical data with today's data
      const mergedData = [...historicalData, ...result]

      const uniqueData = Object.values(mergedData.reduce((acc, item) => {
        const key = `${item.date}_${item.currency_id}`
        if (!acc[key]) {
          acc[key] = item
        }
        return acc
      }, {}))

      const totalPlayers = NumberPrecision.plus(playerCount, playerRegisteredToday[0]?.count || 0)
      const userDepositData = newRegistrations[0]
      return {
        stats: uniqueData,
        totalPlayers,
        totalGames: totalGames || 0,
        totalProviders: totalProviders || 0,
        loggedInUsers: loggedInUsers.length,
        overAllGgr: overAllGgr[0] || [],
        totalRegistrationToday: +userDepositData.total_users_registered_today,
        depositConvRate: NumberPrecision.round(userDepositData.deposit_conv_rate)
      }
    } catch (error) {
      console.log(error)
      throw new APIError('Failed to retrieve statistics', 500)
    }
  }
}
