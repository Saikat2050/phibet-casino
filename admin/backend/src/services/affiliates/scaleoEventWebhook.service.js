import { config } from '@src/configs/config'
import { Sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import { isDateValid, pageValidationForScalio } from '@src/helpers/common.helper'
import { ServiceBase } from '@src/libs/serviceBase'
import { CURRENCY_TYPES, LEDGER_PURPOSE, LEDGER_TRANSACTION_TYPE } from '@src/utils/constants/public.constants.utils'

export class ScaleoEventWebhookService extends ServiceBase {
  async run () {
    let {
      date_start: startDate,
      date_end: endDate,
      'api-key': apiKey,
      type,
      perpage: limit,
      page: pageNo
    } = this.args

    type = type?.split(',')

    try {
      const { page, size } = pageValidationForScalio(pageNo, limit)
      if (apiKey !== config.get('scaleo.api_key')) return this.addError('ApiKeyNotCorrectErrorType')

      if (!startDate || !endDate) {
        startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        startDate.setMonth(startDate.getMonth() - 3)
        endDate = new Date()
        endDate.setHours(23, 59, 59, 999)
      }
      if (!isDateValid(startDate) && !isDateValid(endDate)) return this.addError('InvalidDateErrorType')
      if (new Date(startDate) >= new Date(endDate)) return this.addError('InvalidDateErrorType')

      const countQuery = `SELECT type, COUNT(*) AS count FROM (
            SELECT DISTINCT ON (event_id)
                u.id AS player_id,
                REPLACE(u.affiliate_code::text, '-', '') AS click_id,
                'USD' AS currency,
                CASE
                    WHEN ctl.purpose = '${LEDGER_PURPOSE.CASINO_BET}' THEN 'bet'
                    WHEN ctl.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' THEN 'win'
                END AS type,
                ctl.id AS event_id,
                ctl.amount AS amount
            FROM users u
            LEFT JOIN casino_transactions ct ON ct.user_id = u.id
            LEFT JOIN ledgers ctl ON ctl.transaction_id = ct.id
                AND ctl.transaction_type = '${LEDGER_TRANSACTION_TYPE.CASINO}'
                AND ctl.purpose IN ('${LEDGER_PURPOSE.CASINO_BET}', '${LEDGER_PURPOSE.CASINO_WIN}')
                AND ctl.updated_at BETWEEN '${startDate}' AND '${endDate}'
            LEFT JOIN currencies cc ON cc.id = ctl.currency_id
                AND cc.type = '${CURRENCY_TYPES.SWEEP_COIN}'
            WHERE u.affiliate_code IS NOT NULL
                AND ctl.id IS NOT NULL

            UNION ALL

            SELECT DISTINCT ON (event_id)
                u.id AS player_id,
                REPLACE(u.affiliate_code::text, '-', '') AS click_id,
                'USD' AS currency,
                'bon' AS type,
                tl.id AS event_id,
                tl.amount AS amount
            FROM users u
            LEFT JOIN transactions t ON t.user_id = u.id
            LEFT JOIN ledgers tl ON tl.transaction_id = t.id
                AND tl.purpose IN (
                    '${LEDGER_PURPOSE.JOINING_BONUS}',
                    '${LEDGER_PURPOSE.DAILY_BONUS}',
                    '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}',
                    '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}',
                    '${LEDGER_PURPOSE.SPIN_WHEEL_SC}'
                )
                AND tl.updated_at BETWEEN '${startDate}' AND '${endDate}'
            LEFT JOIN currencies tc ON tc.id = tl.currency_id
                AND tc.type = '${CURRENCY_TYPES.SWEEP_COIN}'
            WHERE u.affiliate_code IS NOT NULL
                AND tl.id IS NOT NULL
        ) AS combined
        GROUP BY type;`

      const totalCount = await this.context.sequelize.query(countQuery, {
        type: Sequelize.QueryTypes.SELECT
      })
      const countObj = {}
      totalCount.map((val) => {
        countObj[val.type] = val.count
        return null
      })

      const query = `
      SELECT
       u.id AS player_id,
       REPLACE(u.affiliate_code::text, '-', '') AS click_id,
       'USD' AS currency,
       CASE
         WHEN ctl.purpose = '${LEDGER_PURPOSE.CASINO_BET}' THEN 'bet'
         WHEN ctl.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' THEN 'win'
       END AS type,
       ctl.amount AS amount
      FROM users u
      LEFT JOIN casino_transactions ct ON ct.user_id = u.id
      LEFT JOIN ledgers ctl ON ctl.transaction_id = ct.id
        AND ctl.transaction_type = '${LEDGER_TRANSACTION_TYPE.CASINO}'
        AND ctl.purpose IN ('${LEDGER_PURPOSE.CASINO_BET}', '${LEDGER_PURPOSE.CASINO_WIN}')
        AND ctl.updated_at BETWEEN '${startDate}' AND '${endDate}'
      LEFT JOIN currencies cc ON cc.id = ctl.currency_id
        AND cc.type = '${CURRENCY_TYPES.SWEEP_COIN}'
      WHERE u.affiliate_code IS NOT NULL
      AND ctl.id IS NOT NULL
      UNION ALL
      SELECT
        u.id AS player_id,
        REPLACE(u.affiliate_code::text, '-', '') AS click_id,
        'USD' AS currency,
        'bon' AS type,
        tl.amount AS amount
      FROM users u
      LEFT JOIN transactions t ON t.user_id = u.id
      LEFT JOIN ledgers tl ON tl.transaction_id = t.id
        AND tl.purpose IN ('${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.SPIN_WHEEL_SC}')
        AND tl.updated_at BETWEEN '${startDate}' AND '${endDate}'
      LEFT JOIN currencies tc ON tc.id = tl.currency_id
        AND tc.type = '${CURRENCY_TYPES.SWEEP_COIN}'
      WHERE u.affiliate_code IS NOT NULL
      AND tl.id IS NOT NULL
      LIMIT ${size} OFFSET ${(page - 1) * size}
      `
      const result = await this.context.sequelize.query(query, {
        type: Sequelize.QueryTypes.SELECT
      })

      const events = result.map(event => {
        if (!type || (type && type.includes(event.type))) {
          event.amount = (event.amount).toFixed(2)
          event.count = +countObj[event.type] || 0
          event.hour = this.args.date_start
          return event
        }
        return null
      }).filter(event => event !== null)

      return { status: 'success', code: 200, data: { events } }
    } catch (error) {
      throw APIError(error)
    }
  }
}
