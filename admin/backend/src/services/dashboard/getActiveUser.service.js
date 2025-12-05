import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { serverDayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { LEDGER_PURPOSE, CURRENCY } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    toDate: { type: 'string', default: serverDayjs().startOf('day') },
    fromDate: { type: 'string', default: serverDayjs().subtract(90, 'day') },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM },
    tagIds: { type: 'string' }
  }
})

export class GetActiveUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { fromDate, toDate, tagIds } = this.args

      let isInternal = false
      if (tagIds) {
        const [[result]] = await this.context.sequelize.query(
          'SELECT 1 FROM public.tags WHERE tag = \'INTERNAL\' AND id = :tagIds',
          { replacements: { tagIds } }
        )

        isInternal = !!result
      }

      const query = `WITH date_intervals AS (
        SELECT
          generate_series(
            '${fromDate}'::timestamp,
            '${toDate}'::timestamp,
            '1 day'::interval
          ) AS start_time
      )
      SELECT
        di.start_time AS date,
        COALESCE(COUNT(DISTINCT CASE
          WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}'
            AND l.currency_id != ${CURRENCY.GC}
            AND u.created_at < di.start_time THEN ctg.user_id
          END),0) AS old_active_sc_player,
        COALESCE(COUNT(DISTINCT CASE
          WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}'
            AND l.currency_id = ${CURRENCY.GC}
            AND u.created_at < di.start_time THEN ctg.user_id
          END),0) AS old_active_gc_player,
        COALESCE(COUNT(DISTINCT CASE
          WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}'
            AND l.currency_id <> ${CURRENCY.GC}
            AND u.created_at >= di.start_time
            AND u.created_at < di.start_time + interval '1 day' THEN ctg.user_id
          END),0) AS new_sc_player,
        COALESCE(COUNT(DISTINCT CASE
          WHEN l.id IS NOT NULL THEN ctg.user_id
          END),0) AS active_player
      FROM
      date_intervals di
      LEFT JOIN
        casino_transactions ctg
        ON ctg.created_at >= di.start_time
        AND ctg.created_at < di.start_time + interval '1 day'
      LEFT JOIN
        ledgers l
        ON l.transaction_id = ctg.id
      LEFT JOIN
        users u
        ON u.id = ctg.user_id
      WHERE 1=1
      ${isInternal
        ? `AND EXISTS (
          SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = ctg.user_id
          AND tg.tag = 'INTERNAL'
          AND ut.updated_at <= ctg.created_at
        )`
          : `AND NOT EXISTS (
          SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = ctg.user_id
          AND tg.tag = 'INTERNAL'
          AND ut.updated_at <= ctg.created_at
      )`}
      GROUP BY
        di.start_time
      ORDER BY
        di.start_time;
      `

      const result = await this.context.sequelize.query(query, {
        type: this.context.sequelize.QueryTypes.SELECT,
        logging: false
      })

      return result || []
    } catch (error) {
      throw new APIError(error)
    }
  }
}
