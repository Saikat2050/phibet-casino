import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { dayjs } from '@src/libs/dayjs'
import { TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { getDates } from '@src/utils/common'
import { LEDGER_PURPOSE, CURRENCY } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    dateOptions: { enum: Object.values(TIME_PERIOD_FILTER), default: TIME_PERIOD_FILTER.TODAY },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 5, maximum: 500, default: 5 }
  }
})

export class GetTopWinnersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { order, perPage, page } = this.args
      const { fromDate, toDate } = getDates(this.args.dateOptions, this.args.fromDate || dayjs().startOf('month'), this.args.toDate || dayjs().endOf('day'))

      const query = `WITH existing_data AS (
        SELECT
          ps.user_id AS "userId",
          u.username AS "userName",
          COALESCE(ROUND(SUM(ps.sc_casino_wins)::NUMERIC, 2), 0) AS "scCasinoWins",
          COALESCE(ROUND(SUM(ps.sc_casino_win_rollback)::NUMERIC, 2), 0) AS "scCasinoWinRollback"
        FROM player_report_aggregates AS ps
        INNER JOIN public.users AS u ON ps.user_id = u.id
        WHERE (from_date, till_date) OVERLAPS (TIMESTAMP '${fromDate}', TIMESTAMP '${toDate}')
        AND ps.user_id IS NOT NULL
        GROUP BY ps.user_id, u.username
      ),
      computed_missing_data AS (
        SELECT
          w.user_id AS "userId",
          u.username AS "username",
          ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND l.currency_id != ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "scCasinoWins",
          ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "scCasinoWinRollback"
        FROM public.ledgers AS l
        INNER JOIN public.wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
        INNER JOIN public.users AS u ON w.user_id = u.id
        WHERE l.created_at <= '${toDate}'::TIMESTAMP
        AND l.created_at > (SELECT COALESCE(MAX(till_date), '${fromDate}') FROM player_report_aggregates)
        AND NOT EXISTS (
          SELECT 1 FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = w.user_id AND tg.tag = 'INTERNAL'
        )
        GROUP BY w.user_id, u.username
      ),
      combined_data AS (
        SELECT * FROM existing_data
        UNION ALL
        SELECT * FROM computed_missing_data
      )
      SELECT json_agg(t) AS "topWinners"
        FROM (
          SELECT
            "userId",
            "userName",
            COALESCE(ROUND(SUM("scCasinoWins" - "scCasinoWinRollback")::NUMERIC, 2), 0) AS "netWinnings"
          FROM combined_data
          GROUP BY "userId", "userName"
          ORDER BY "netWinnings" ${order}
          LIMIT ${perPage} OFFSET ${(page - 1) * perPage}
        ) t;
      `
      const result = await this.context.sequelize.query(query, {
        type: this.context.sequelize.QueryTypes.SELECT,
        logging: false
      })
      const topWinners = result[0]?.topWinners || []
      return topWinners
    } catch (error) {
      throw new APIError(error)
    }
  }
}
