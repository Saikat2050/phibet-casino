import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { LEDGER_PURPOSE, CURRENCY, LEDGER_TRANSACTION_TYPE, WITHDRAWAL_STATUS } from '@src/utils/constants/public.constants.utils'
import { Readable } from 'stream'
import { Parser } from 'json2csv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    // csvDownload: { type: 'boolean', default: false }, // no need
    // currencyId: { type: 'string', default: '1' }, no need
    searchString: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 5, maximum: 500, default: 5 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    userId: { type: 'string' },
    orderBy: {
      enum: ['gcStakedAmount', 'gcBetCount', 'scStakedAmount', 'scBetCount', 'scCasinoWins', 'gcCasinoWins', 'gcCasinoBetRollback', 'scCasinoBetRollback', 'gcCasinoWinRollback', 'scCasinoWinRollback', 'gcPurchases', 'scPurchases', 'scRewards', 'gcRewards', 'redeemRejectedAmount', 'redeemFailedAmount', 'redeemCompletedAmount', 'netProfit'
      ],
      default: 'netProfit'
    },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM },
    csvDownload: { type: ['string', 'null'] },
    tagIds: { type: 'string' },
    type: { enum: ['dashboard', 'all'], default: 'all' } // for player count query
  },
  required: []
})

export class GetPlayerPerformanceReportServiceV1 extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { searchString, perPage, page, orderBy, order, userId, type, fromDate, toDate, csvDownload, tagIds } = this.args

    try {
      let isInternal = false
      if (tagIds) {
        const [[result]] = await this.context.sequelize.query(
          'SELECT 1 FROM public.tags WHERE tag = \'INTERNAL\' AND id = :tagIds',
          { replacements: { tagIds } }
        )

        isInternal = !!result
      }

      const query = `WITH existing_data AS (
        SELECT
          ps.user_id AS "userId",
          u.username AS "username",
          u.email AS "email",
          COALESCE(ROUND(SUM(ps.gc_staked_amount)::NUMERIC, 2), 0) AS "gcStakedAmount",
          COALESCE(ROUND(SUM(ps.gc_bet_count)::NUMERIC, 0), 0) AS "gcBetCount",
          COALESCE(ROUND(SUM(ps.sc_staked_amount)::NUMERIC, 2), 0) AS "scStakedAmount",
          COALESCE(ROUND(SUM(ps.sc_bet_count)::NUMERIC, 0), 0) AS "scBetCount",
          COALESCE(ROUND(SUM(ps.sc_casino_wins)::NUMERIC, 2), 0) AS "scCasinoWins",
          COALESCE(ROUND(SUM(ps.gc_casino_wins)::NUMERIC, 2), 0) AS "gcCasinoWins",
          COALESCE(ROUND(SUM(ps.gc_casino_bet_rollback)::NUMERIC, 2), 0) AS "gcCasinoBetRollback",
          COALESCE(ROUND(SUM(ps.sc_casino_bet_rollback)::NUMERIC, 2), 0) AS "scCasinoBetRollback",
          COALESCE(ROUND(SUM(ps.gc_casino_win_rollback)::NUMERIC, 2), 0) AS "gcCasinoWinRollback",
          COALESCE(ROUND(SUM(ps.sc_casino_win_rollback)::NUMERIC, 2), 0) AS "scCasinoWinRollback",
          COALESCE(ROUND(SUM(ps.gc_purchases)::NUMERIC, 2), 0) AS "gcPurchases",
          COALESCE(ROUND(SUM(ps.sc_purchases)::NUMERIC, 2), 0) AS "scPurchases",
          COALESCE(ROUND(SUM(ps.sc_rewards)::NUMERIC, 2), 0) AS "scRewards",
          COALESCE(ROUND(SUM(ps.gc_rewards)::NUMERIC, 2), 0) AS "gcRewards",
          COALESCE(ROUND(SUM(ps.redeem_rejected_amount)::NUMERIC, 2), 0) AS "redeemRejectedAmount",
          COALESCE(ROUND(SUM(ps.redeem_failed_amount)::NUMERIC, 2), 0) AS "redeemFailedAmount",
          COALESCE(ROUND(SUM(ps.redeem_completed_amount)::NUMERIC, 2), 0) AS "redeemCompletedAmount",
          COALESCE(ROUND(SUM(ps.net_profit)::NUMERIC, 2), 0) AS "netProfit"
        FROM player_report_aggregates AS ps
        INNER JOIN public.users AS u ON ps.user_id = u.id
        WHERE (from_date, till_date) OVERLAPS(TIMESTAMP '${fromDate}', TIMESTAMP '${toDate}')
        ${searchString ? `AND (u.email LIKE '%${searchString}%' OR u.username LIKE '%${searchString}%')` : ''}
        ${userId ? `AND ps.user_id = ${userId}` : ''}
        AND ps.user_id IS NOT NULL
        AND is_internal = ${isInternal}
        GROUP BY ps.user_id, u.username, u.email
      ),
      computed_missing_data AS (
        SELECT
          w.user_id AS "userId",
          u.username AS "username",
          u.email AS "email",

          ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "gcStakedAmount",

          COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id = ${CURRENCY.GC} THEN l.id ELSE NULL END) AS "gcBetCount",

          ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id != ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "scStakedAmount",

          COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id != ${CURRENCY.GC} THEN l.id ELSE NULL END) AS "scBetCount",

          ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND l.currency_id != ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "scCasinoWins",

          ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "gcCasinoWins",

          ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "gcCasinoBetRollback",

          ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND l.currency_id != ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "scCasinoBetRollback",

          ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "gcCasinoWinRollback",

          ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND l.currency_id != ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "scCasinoWinRollback",

          ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_COIN}' AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "gcPurchases",

          ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_COIN}' AND l.currency_id = ${CURRENCY.PSC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "scPurchases",

          ROUND(CAST(SUM(CASE WHEN l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_SC}') AND l.currency_id = ${CURRENCY.BSC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "scRewards",

          ROUND(CAST(SUM(CASE WHEN l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_GC}') AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "gcRewards",

          ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.REDEEM_REJECTED}' AND l.transaction_type = '${LEDGER_TRANSACTION_TYPE.REDEEM}' AND l.currency_id = ${CURRENCY.RSC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "redeemRejectedAmount",

          ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.REDEEM_FAILED}' AND l.transaction_type = '${LEDGER_TRANSACTION_TYPE.REDEEM}' AND l.currency_id = ${CURRENCY.RSC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "redeemFailedAmount",

          ( SELECT COALESCE(SUM(l_sub.amount), 0)
            FROM ledgers l_sub
              WHERE l_sub.purpose = '${LEDGER_PURPOSE.REDEEM}'
              AND l_sub.currency_id = ${CURRENCY.RSC}
              AND EXISTS (
                SELECT 1 FROM withdrawals w_sub
                WHERE w_sub.transaction_id :: BIGINT = l_sub.transaction_id
                AND w_sub.status = '${WITHDRAWAL_STATUS.APPROVED}'
                AND w_sub.user_id = w.user_id
              )
          ) AS "redeemCompletedAmount",

          ROUND(CAST(
            (SUM(CASE
              WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id != ${CURRENCY.GC}
              THEN l.amount
              ELSE 0
            END)
          - SUM(CASE
              WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND l.currency_id != ${CURRENCY.GC}
              THEN l.amount
              ELSE 0
            END))
          - (SUM(CASE
              WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND l.currency_id != ${CURRENCY.GC}
              THEN l.amount
              ELSE 0
            END)
          - SUM(CASE
              WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND l.currency_id != ${CURRENCY.GC}
              THEN l.amount
              ELSE 0
            END))
          AS NUMERIC), 2) AS "netProfit"

        FROM public.ledgers AS l
        INNER JOIN public.wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
        INNER JOIN public.users AS u ON w.user_id = u.id
        WHERE l.created_at <= '${toDate}'::TIMESTAMP
        AND l.created_at >= (SELECT COALESCE(MAX(till_date), '${fromDate}') FROM player_report_aggregates)
        ${searchString ? `AND (u.email LIKE '%${searchString}%' OR u.username LIKE '%${searchString}%')` : ''}
        ${userId ? `AND w.user_id = ${userId}` : ''}
        ${isInternal
          ? `AND EXISTS (
            SELECT 1
            FROM public.user_tags ut
            INNER JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = w.user_id
            AND tg.tag = 'INTERNAL'
            AND ut.updated_at <= l.created_at
        )`
          : `AND NOT EXISTS (
        SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = w.user_id
          AND tg.tag = 'INTERNAL'
          AND ut.updated_at <= l.created_at
        )`}
        GROUP BY w.user_id, u.username, u.email
      ),
      combined_data AS (
        SELECT * FROM existing_data
        UNION ALL
        SELECT * FROM computed_missing_data
      ),
      paginated_results AS (
        SELECT
          "userId",
          "username",
          "email",
          COALESCE(ROUND(SUM("gcStakedAmount")::NUMERIC, 2), 0) AS "gcStakedAmount",
          COALESCE(ROUND(SUM("gcBetCount")::NUMERIC, 0), 0) AS "gcBetCount",
          COALESCE(ROUND(SUM("scStakedAmount")::NUMERIC, 2), 0) AS "scStakedAmount",
          COALESCE(ROUND(SUM("scBetCount")::NUMERIC, 0), 0) AS "scBetCount",
          COALESCE(ROUND(SUM("scCasinoWins")::NUMERIC, 2), 0) AS "scCasinoWins",
          COALESCE(ROUND(SUM("gcCasinoWins")::NUMERIC, 2), 0) AS "gcCasinoWins",
          COALESCE(ROUND(SUM("gcCasinoBetRollback")::NUMERIC, 2), 0) AS "gcCasinoBetRollback",
          COALESCE(ROUND(SUM("scCasinoBetRollback")::NUMERIC, 2), 0) AS "scCasinoBetRollback",
          COALESCE(ROUND(SUM("gcCasinoWinRollback")::NUMERIC, 2), 0) AS "gcCasinoWinRollback",
          COALESCE(ROUND(SUM("scCasinoWinRollback")::NUMERIC, 2), 0) AS "scCasinoWinRollback",
          COALESCE(ROUND(SUM("gcPurchases")::NUMERIC, 2), 0) AS "gcPurchases",
          COALESCE(ROUND(SUM("scPurchases")::NUMERIC, 2), 0) AS "scPurchases",
          COALESCE(ROUND(SUM("scRewards")::NUMERIC, 2), 0) AS "scRewards",
          COALESCE(ROUND(SUM("gcRewards")::NUMERIC, 2), 0) AS "gcRewards",
          COALESCE(ROUND(SUM("redeemRejectedAmount")::NUMERIC, 2), 0) AS "redeemRejectedAmount",
          COALESCE(ROUND(SUM("redeemFailedAmount")::NUMERIC, 2), 0) AS "redeemFailedAmount",
          COALESCE(ROUND(SUM("redeemCompletedAmount")::NUMERIC, 2), 0) AS "redeemCompletedAmount",
          COALESCE(ROUND(SUM("netProfit")::NUMERIC, 2), 0) AS "netProfit"
        FROM combined_data
        GROUP BY "userId", "username", "email"
        ORDER BY "${orderBy}" ${order}
        LIMIT :limit OFFSET :offset
      ),
      total_count AS (
        SELECT
          CASE
            WHEN '${type}' = 'all' THEN COUNT(DISTINCT "userId")
            ELSE 0
          END AS "totalCount"
        FROM combined_data
      )
      SELECT
        (SELECT json_agg(t) FROM paginated_results t) AS "reportData",
        (SELECT "totalCount" FROM total_count) AS "totalCount";
    `
      if (csvDownload === 'true') {
        const stream = new Readable({ objectMode: true })

        let offset = 0
        const limit = 10000

        stream._read = async () => {
          try {
            const { rows: combinedChunk } = await this.context.sequelize.query(query, {
              type: this.context.sequelize.QueryTypes.SELECT,
              replacements: { limit, offset },
              raw: true
            })

            if (combinedChunk?.length > 0) {
              const modifiedChunk = combinedChunk.map(({
                email,
                username,
                netProfit,
                scRewards,
                scStakedAmount,
                scBetCount,
                scCasinoWins,
                scCasinoBetRollback,
                scCasinoWinRollback,
                scPurchases,
                gcRewards,
                gcPurchases,
                gcStakedAmount,
                gcBetCount,
                gcCasinoWins,
                gcCasinoBetRollback,
                gcCasinoWinRollback,
                redeemCompletedAmount,
                redeemFailedAmount,
                redeemRejectedAmount
              }) => {
                return {
                  Email: email || null,
                  Username: username || null,
                  'Net Profit': netProfit || null,
                  'SC Rewards': scRewards || null,
                  'SC Wagered Amount': scStakedAmount || null,
                  'SC Bet Count': scBetCount || null,
                  'SC Casino Wins': scCasinoWins || null,
                  'SC Casino Bet Rollback': scCasinoBetRollback || null,
                  'SC Casino Win Rollback': scCasinoWinRollback || null,
                  'SC Purchases': scPurchases || null,
                  'GC Rewards': gcRewards || null,
                  'GC Purchases': gcPurchases || null,
                  'GC Wagered Amount': gcStakedAmount || null,
                  'GC Bet Count': gcBetCount || null,
                  'GC Casino Wins': gcCasinoWins || null,
                  'GC Casino Bet Rollback': gcCasinoBetRollback || null,
                  'GC Casino Win Rollback': gcCasinoWinRollback || null,
                  'Redeem Completed Amount': redeemCompletedAmount || null,
                  'Redeem Failed Amount': redeemFailedAmount || null,
                  'Redeem Rejected Amount': redeemRejectedAmount || null
                }
              })

              const json2csv = new Parser()
              const csv = json2csv.parse(modifiedChunk)
              stream.push(csv + '\n')
              offset += limit
            } else {
              // End the stream when no more data
              stream.push(null)
            }
          } catch (error) {
            console.log('Stream Error:', error)
            stream.emit('error', error)
          }
        }

        return stream
      }

      const result = await this.context.sequelize.query(query, {
        type: this.context.sequelize.QueryTypes.SELECT,
        replacements: { limit: perPage, offset: (page - 1) * perPage },
        logging: false
      })
      const reportData = result[0].reportData || []
      const totalCount = result[0].totalCount

      return {
        totalPages: totalCount ? Math.ceil(totalCount / perPage) : 0,
        page,
        reportData
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
