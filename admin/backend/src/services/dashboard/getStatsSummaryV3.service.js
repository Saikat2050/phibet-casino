import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { serverDayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { REPORT_TIME_PERIOD_FILTER, CACHE_STORE_PREFIXES } from '@src/utils/constants/app.constants'
import { LEDGER_PURPOSE, WITHDRAWAL_STATUS, CURRENCY, CURRENCY_TYPES, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import { Cache } from '@src/libs/cache'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    currencyId: { type: 'string' },
    timezone: { type: 'string' },
    toDate: { type: 'string', default: serverDayjs().startOf('day') },
    fromDate: { type: 'string', default: serverDayjs().subtract(90, 'day') },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM },
    tagIds: { type: 'string' }
  }
})

export class GetStatsSummaryV3Service extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { fromDate, toDate, timezone, tagIds } = this.args
    let isInternal = false
    const promises = []
    if (tagIds) {
      const [[result]] = await this.context.sequelize.query(
        'SELECT 1 FROM public.tags WHERE tag = \'INTERNAL\' AND id = :tagIds',
        { replacements: { tagIds } }
      )

      isInternal = !!result
    }

    try {
      const query = `
      WITH adjusted_intervals AS (
        SELECT generate_series (
          '${fromDate}'::timestamp,
          '${toDate}'::timestamp,
          '1 day'::interval
        ) AS report_day
      ),

      latest_cumulative_time AS (
        SELECT MAX(to_date) AS last_cumulative_time
        FROM performance_report
      ),

      missing_ledger_data AS (
        SELECT
          (SELECT CURRENT_DATE AT TIME ZONE '${timezone}') AS report_day,

          COALESCE(ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_SC}') AND l.currency_id = ${CURRENCY.BSC} ) AS NUMERIC), 2), 0) AS sc_rewards,

          COALESCE(COUNT(l.id) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_SC}') AND l.currency_id = ${CURRENCY.BSC}), 0) AS sc_rewards_count,

          COALESCE(ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_GC}') AND l.currency_id = ${CURRENCY.GC} ) AS NUMERIC), 2), 0) AS gc_rewards,

          COALESCE(COUNT(l.id) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_GC}') AND l.currency_id = ${CURRENCY.GC}), 0) AS gc_rewards_count,

          COALESCE(COUNT(l.id) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_COIN}', '${LEDGER_PURPOSE.PURCHASE_SC_COIN}')), 0) AS purchase_count,

          COALESCE(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_COIN}', '${LEDGER_PURPOSE.PURCHASE_SC_COIN}')), 0) AS purchase_amount,

          COALESCE(SUM(l.amount) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_COIN}' AND l.currency_id = ${CURRENCY.GC}), 0) AS purchase_gc_amount,

          COALESCE(COUNT(l.id) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_COIN}' AND l.currency_id = ${CURRENCY.GC}), 0) AS purchase_gc_count,

          COALESCE(SUM(l.amount) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_COIN}' AND l.currency_id = ${CURRENCY.PSC}), 0) AS psc_amount,

          COALESCE(COUNT(l.id) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_COIN}' AND l.currency_id = ${CURRENCY.PSC}), 0) AS psc_count,

          COALESCE(SUM(l.amount) FILTER (WHERE l.currency_id = ${CURRENCY.GC} AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_BONUS}'), 0) AS bonus_gc_amount,

          COALESCE(COUNT(l.id) FILTER (WHERE l.currency_id = ${CURRENCY.GC} AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_BONUS}'), 0) AS bonus_gc_count,

          COALESCE(SUM(l.amount) FILTER (WHERE l.currency_id = ${CURRENCY.BSC} AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}'), 0) AS bonus_bsc_amount,

          COALESCE(COUNT(l.id) FILTER (WHERE l.currency_id = ${CURRENCY.BSC} AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}'), 0) AS bonus_bsc_count,

          COALESCE(ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END)::NUMERIC, 2), 0) AS gc_total_bet_amount,

          COALESCE(COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id = ${CURRENCY.GC} THEN l.id ELSE NULL END), 0) AS gc_total_bet_count,

          COALESCE(ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END)::NUMERIC, 2), 0) AS gc_total_win_amount,

          COALESCE(COUNT(l.id) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND l.currency_id = ${CURRENCY.GC}), 0) AS gc_total_win_count,

          COALESCE(ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id != ${CURRENCY.GC} THEN l.amount ELSE 0 END)::NUMERIC, 2), 0) AS sc_total_bet_amount,

          COALESCE(COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id != ${CURRENCY.GC} THEN l.id ELSE NULL END), 0) AS sc_total_bet_count,

          COALESCE(ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND l.currency_id != ${CURRENCY.GC} THEN l.amount ELSE 0 END)::NUMERIC, 2), 0) AS sc_total_win_amount,

          COALESCE(COUNT(l.id) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND l.currency_id != ${CURRENCY.GC}), 0) AS sc_total_win_count,

          COALESCE(ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END)::NUMERIC, 2), 0) AS gc_casino_bet_rollback,

          COALESCE(COUNT(l.id) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND l.currency_id = ${CURRENCY.GC}), 0) AS gc_casino_bet_rollback_count,

          COALESCE(ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND l.currency_id != ${CURRENCY.GC} THEN l.amount ELSE 0 END)::NUMERIC, 2), 0) AS sc_casino_bet_rollback,

          COALESCE(COUNT(l.id) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND l.currency_id != ${CURRENCY.GC}), 0) AS sc_casino_bet_rollback_count,

          COALESCE(ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END)::NUMERIC, 2), 0) AS gc_casino_win_rollback,

          COALESCE(COUNT(l.id) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND l.currency_id = ${CURRENCY.GC}), 0) AS gc_casino_win_rollback_count,

          COALESCE(ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND l.currency_id != ${CURRENCY.GC} THEN l.amount ELSE 0 END)::NUMERIC, 2), 0) AS sc_casino_win_rollback,

          COALESCE(COUNT(l.id) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND l.currency_id != ${CURRENCY.GC}), 0) AS sc_casino_win_rollback_count

        FROM ledgers l
          JOIN wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
          where l.created_at >= (SELECT last_cumulative_time FROM latest_cumulative_time)
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
      ),

      missing_withdrawal_data AS (
        SELECT
          (SELECT CURRENT_DATE AT TIME ZONE '${timezone}') AS report_day,

          COALESCE(COUNT(CASE WHEN w.status = '${WITHDRAWAL_STATUS.REJECTED}' THEN w.id END), 0) AS rejected_redeem_request_count,

          COALESCE(SUM(CASE WHEN w.status = '${WITHDRAWAL_STATUS.REJECTED}' THEN w.amount ELSE 0 END), 0) AS rejected_redeem_request_amount,

          COALESCE(COUNT(CASE WHEN w.status = '${WITHDRAWAL_STATUS.APPROVED}' THEN w.id END), 0) AS success_redeem_request_count,

          COALESCE(SUM(CASE WHEN w.status = '${WITHDRAWAL_STATUS.APPROVED}' THEN w.amount ELSE 0 END), 0) AS success_redeem_request_amount,

          COALESCE(COUNT(CASE WHEN w.status = '${WITHDRAWAL_STATUS.FAILED}' THEN w.id END), 0) AS failed_redeem_request_count,

          COALESCE(SUM(CASE WHEN w.status = '${WITHDRAWAL_STATUS.FAILED}' THEN w.amount ELSE 0 END), 0) AS failed_redeem_request_amount

        FROM  withdrawals w
        where w.updated_at >= (SELECT last_cumulative_time FROM latest_cumulative_time)
          AND w.status IN ('${WITHDRAWAL_STATUS.APPROVED}', '${WITHDRAWAL_STATUS.FAILED}', '${WITHDRAWAL_STATUS.REJECTED}')
          ${isInternal
          ? `AND EXISTS (
          SELECT 1
            FROM public.user_tags ut
            INNER JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = w.user_id
            AND tg.tag = 'INTERNAL'
            AND ut.updated_at <= w.updated_at
        )`
          : `AND NOT EXISTS (
          SELECT 1
            FROM public.user_tags ut
            INNER JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = w.user_id
            AND tg.tag = 'INTERNAL'
            AND ut.updated_at <= w.updated_at
        )`}
      ),

      missing_data AS (
        SELECT
          ld.sc_rewards AS sc_rewards,
          ld.sc_rewards AS sc_rewards,
          ld.sc_rewards_count AS sc_rewards_count,
          ld.gc_rewards AS gc_rewards,
          ld.gc_rewards_count AS gc_rewards_count,
          ld.purchase_count AS purchase_count,
          ld.purchase_amount AS purchase_amount,
          ld.purchase_gc_amount AS purchase_gc_amount,
          ld.purchase_gc_count AS purchase_gc_count,
          ld.psc_amount AS psc_amount,
          ld.psc_count AS psc_count,
          ld.bonus_gc_amount AS bonus_gc_amount,
          ld.bonus_gc_count AS bonus_gc_count,
          ld.bonus_bsc_amount AS bonus_bsc_amount,
          ld.bonus_bsc_count AS bonus_bsc_count,
          ld.gc_total_bet_amount AS gc_total_bet_amount,
          ld.gc_total_bet_count AS gc_total_bet_count,
          ld.gc_total_win_amount AS gc_total_win_amount,
          ld.gc_total_win_count AS gc_total_win_count,
          ld.sc_total_bet_amount AS sc_total_bet_amount,
          ld.sc_total_bet_count AS sc_total_bet_count,
          ld.sc_total_win_amount AS sc_total_win_amount,
          ld.sc_total_win_count AS sc_total_win_count,
          ld.gc_casino_bet_rollback AS gc_casino_bet_rollback,
          ld.gc_casino_bet_rollback_count AS gc_casino_bet_rollback_count,
          ld.sc_casino_bet_rollback AS sc_casino_bet_rollback,
          ld.sc_casino_bet_rollback_count AS sc_casino_bet_rollback_count,
          ld.gc_casino_win_rollback AS gc_casino_win_rollback,
          ld.gc_casino_win_rollback_count AS gc_casino_win_rollback_count,
          ld.sc_casino_win_rollback AS sc_casino_win_rollback,
          ld.sc_casino_win_rollback_count AS sc_casino_win_rollback_count,
          wd.rejected_redeem_request_count AS rejected_redeem_request_count,
          wd.rejected_redeem_request_amount AS rejected_redeem_request_amount,
          wd.success_redeem_request_count AS success_redeem_request_count,
          wd.success_redeem_request_amount AS success_redeem_request_amount,
          wd.failed_redeem_request_count AS failed_redeem_request_count,
          wd.failed_redeem_request_amount AS total_failed_redeem_request_amount
        FROM missing_ledger_data ld, missing_withdrawal_data wd
      ),

      today_report AS (
        SELECT
          COALESCE(SUM(pr.sc_rewards), 0) AS sc_rewards,
          COALESCE(SUM(pr.sc_rewards_count), 0) AS sc_rewards_count,
          COALESCE(SUM(pr.gc_rewards), 0) AS gc_rewards,
          COALESCE(SUM(pr.gc_rewards_count), 0) AS gc_rewards_count,
          COALESCE(SUM(pr.purchase_count), 0) AS purchase_count,
          COALESCE(SUM(pr.purchase_amount), 0) AS purchase_amount,
          COALESCE(SUM(pr.purchase_gc_amount), 0) AS purchase_gc_amount,
          COALESCE(SUM(pr.purchase_gc_count), 0) AS purchase_gc_count,
          COALESCE(SUM(pr.psc_amount), 0) AS psc_amount,
          COALESCE(SUM(pr.psc_count), 0) AS psc_count,
          COALESCE(SUM(pr.bonus_gc_amount), 0) AS bonus_gc_amount,
          COALESCE(SUM(pr.bonus_gc_count), 0) AS bonus_gc_count,
          COALESCE(SUM(pr.bonus_bsc_amount), 0) AS bonus_bsc_amount,
          COALESCE(SUM(pr.bonus_bsc_count), 0) AS bonus_bsc_count,
          COALESCE(SUM(pr.gc_total_bet_amount), 0) AS gc_total_bet_amount,
          COALESCE(SUM(pr.gc_total_bet_count), 0) AS gc_total_bet_count,
          COALESCE(SUM(pr.gc_total_win_amount), 0) AS gc_total_win_amount,
          COALESCE(SUM(pr.gc_total_win_count), 0) AS gc_total_win_count,
          COALESCE(SUM(pr.sc_total_bet_amount), 0) AS sc_total_bet_amount,
          COALESCE(SUM(pr.sc_total_bet_count), 0) AS sc_total_bet_count,
          COALESCE(SUM(pr.sc_total_win_amount), 0) AS sc_total_win_amount,
          COALESCE(SUM(pr.sc_total_win_count), 0) AS sc_total_win_count,
          COALESCE(SUM(pr.gc_casino_bet_rollback), 0) AS gc_casino_bet_rollback,
          COALESCE(SUM(pr.gc_casino_bet_rollback_count), 0) AS gc_casino_bet_rollback_count,
          COALESCE(SUM(pr.sc_casino_bet_rollback), 0) AS sc_casino_bet_rollback,
          COALESCE(SUM(pr.sc_casino_bet_rollback_count), 0) AS sc_casino_bet_rollback_count,
          COALESCE(SUM(pr.gc_casino_win_rollback), 0) AS gc_casino_win_rollback,
          COALESCE(SUM(pr.gc_casino_win_rollback_count), 0) AS gc_casino_win_rollback_count,
          COALESCE(SUM(pr.sc_casino_win_rollback), 0) AS sc_casino_win_rollback,
          COALESCE(SUM(pr.sc_casino_win_rollback_count), 0) AS sc_casino_win_rollback_count,
          COALESCE(SUM(pr.rejected_redeem_request_count), 0) AS rejected_redeem_request_count,
          COALESCE(SUM(pr.rejected_redeem_request_amount), 0) AS rejected_redeem_request_amount,
          COALESCE(SUM(pr.success_redeem_request_count), 0) AS success_redeem_request_count,
          COALESCE(SUM(pr.success_redeem_request_amount), 0) AS success_redeem_request_amount,
          COALESCE(SUM(pr.failed_redeem_request_count), 0) AS failed_redeem_request_count,
          COALESCE(SUM(pr.failed_redeem_request_amount), 0) AS failed_redeem_request_amount
        FROM performance_report pr
        WHERE pr.from_date >= (SELECT CURRENT_DATE AT TIME ZONE '${timezone}')
        AND pr.is_internal = ${isInternal}
      ),

      today_grouped_report AS (
        SELECT
          pd.sc_rewards + ld.sc_rewards AS sc_rewards,
          pd.sc_rewards_count + ld.sc_rewards_count AS sc_rewards_count,
          pd.gc_rewards + ld.gc_rewards AS gc_rewards,
          pd.gc_rewards_count + ld.gc_rewards_count AS gc_rewards_count,
          pd.purchase_count + ld.purchase_count AS purchase_count,
          pd.purchase_amount + ld.purchase_amount AS purchase_amount,
          pd.purchase_gc_amount + ld.purchase_gc_amount AS purchase_gc_amount,
          pd.purchase_gc_count + ld.purchase_gc_count AS purchase_gc_count,
          pd.psc_amount + ld.psc_amount AS psc_amount,
          pd.psc_count + ld.psc_count AS psc_count,
          pd.bonus_gc_amount + ld.bonus_gc_amount AS bonus_gc_amount,
          pd.bonus_gc_count + ld.bonus_gc_count AS bonus_gc_count,
          pd.bonus_bsc_amount + ld.bonus_bsc_amount AS bonus_bsc_amount,
          pd.bonus_bsc_count + ld.bonus_bsc_count AS bonus_bsc_count,
          pd.gc_total_bet_amount + ld.gc_total_bet_amount AS gc_total_bet_amount,
          pd.gc_total_bet_count + ld.gc_total_bet_count AS gc_total_bet_count,
          pd.gc_total_win_amount + ld.gc_total_win_amount AS gc_total_win_amount,
          pd.gc_total_win_count + ld.gc_total_win_count AS gc_total_win_count,
          pd.sc_total_bet_amount + ld.sc_total_bet_amount AS sc_total_bet_amount,
          pd.sc_total_bet_count + ld.sc_total_bet_count AS sc_total_bet_count,
          pd.sc_total_win_amount + ld.sc_total_win_amount AS sc_total_win_amount,
          pd.sc_total_win_count + ld.sc_total_win_count AS sc_total_win_count,
          pd.gc_casino_bet_rollback + ld.gc_casino_bet_rollback AS gc_casino_bet_rollback,
          pd.gc_casino_bet_rollback_count + ld.gc_casino_bet_rollback_count AS gc_casino_bet_rollback_count,
          pd.sc_casino_bet_rollback + ld.sc_casino_bet_rollback AS sc_casino_bet_rollback,
          pd.sc_casino_bet_rollback_count + ld.sc_casino_bet_rollback_count AS sc_casino_bet_rollback_count,
          pd.gc_casino_win_rollback + ld.gc_casino_win_rollback AS gc_casino_win_rollback,
          pd.gc_casino_win_rollback_count + ld.gc_casino_win_rollback_count AS gc_casino_win_rollback_count,
          pd.sc_casino_win_rollback + ld.sc_casino_win_rollback AS sc_casino_win_rollback,
          pd.sc_casino_win_rollback_count + ld.sc_casino_win_rollback_count AS sc_casino_win_rollback_count,
          pd.rejected_redeem_request_count + wd.rejected_redeem_request_count AS rejected_redeem_request_count,
          pd.rejected_redeem_request_amount + wd.rejected_redeem_request_amount AS rejected_redeem_request_amount,
          pd.success_redeem_request_count + wd.success_redeem_request_count AS success_redeem_request_count,
          pd.success_redeem_request_amount + wd.success_redeem_request_amount AS success_redeem_request_amount,
          pd.failed_redeem_request_count + wd.failed_redeem_request_count AS failed_redeem_request_count,
          pd.failed_redeem_request_amount + wd.failed_redeem_request_amount AS total_failed_redeem_request_amount
        FROM today_report pd, missing_ledger_data ld, missing_withdrawal_data wd
      ),

      cumulative_data AS (
        SELECT
          ai.report_day,

          COALESCE(SUM(pr.sc_rewards), 0) AS sc_rewards,

          COALESCE(SUM(pr.sc_rewards_count), 0) AS sc_rewards_count,

          COALESCE(SUM(pr.gc_rewards), 0) AS gc_rewards,

          COALESCE(SUM(pr.gc_rewards_count), 0) AS gc_rewards_count,

          COALESCE(SUM(pr.purchase_count), 0) AS purchase_count,

          COALESCE(SUM(pr.purchase_amount), 0) AS purchase_amount,

          COALESCE(SUM(pr.purchase_gc_amount), 0) AS purchase_gc_amount,

          COALESCE(SUM(pr.purchase_gc_count), 0) AS purchase_gc_count,

          COALESCE(SUM(pr.psc_amount), 0) AS psc_amount,

          COALESCE(SUM(pr.psc_count), 0) AS psc_count,

          COALESCE(SUM(pr.bonus_gc_amount), 0) AS bonus_gc_amount,

          COALESCE(SUM(pr.bonus_gc_count), 0) AS bonus_gc_count,

          COALESCE(SUM(pr.bonus_bsc_amount), 0) AS bonus_bsc_amount,

          COALESCE(SUM(pr.bonus_bsc_count), 0) AS bonus_bsc_count,

          COALESCE(SUM(pr.gc_total_bet_amount), 0) AS gc_total_bet_amount,

          COALESCE(SUM(pr.gc_total_bet_count), 0) AS gc_total_bet_count,

          COALESCE(SUM(pr.gc_total_win_amount), 0) AS gc_total_win_amount,

          COALESCE(SUM(pr.gc_total_win_count), 0) AS gc_total_win_count,

          COALESCE(SUM(pr.sc_total_bet_amount), 0) AS sc_total_bet_amount,

          COALESCE(SUM(pr.sc_total_bet_count), 0) AS sc_total_bet_count,

          COALESCE(SUM(pr.sc_total_win_amount), 0) AS sc_total_win_amount,

          COALESCE(SUM(pr.sc_total_win_count), 0) AS sc_total_win_count,

          COALESCE(SUM(pr.gc_casino_bet_rollback), 0) AS gc_casino_bet_rollback,

          COALESCE(SUM(pr.gc_casino_bet_rollback_count), 0) AS gc_casino_bet_rollback_count,

          COALESCE(SUM(pr.sc_casino_bet_rollback), 0) AS sc_casino_bet_rollback,

          COALESCE(SUM(pr.sc_casino_bet_rollback_count), 0) AS sc_casino_bet_rollback_count,

          COALESCE(SUM(pr.gc_casino_win_rollback), 0) AS gc_casino_win_rollback,

          COALESCE(SUM(pr.gc_casino_win_rollback_count), 0) AS gc_casino_win_rollback_count,

          COALESCE(SUM(pr.sc_casino_win_rollback), 0) AS sc_casino_win_rollback,

          COALESCE(SUM(pr.sc_casino_win_rollback_count), 0) AS sc_casino_win_rollback_count,

          COALESCE(SUM(pr.rejected_redeem_request_count), 0) AS rejected_redeem_request_count,

          COALESCE(SUM(pr.rejected_redeem_request_amount), 0) AS rejected_redeem_request_amount,

          COALESCE(SUM(pr.success_redeem_request_count), 0) AS success_redeem_request_count,

          COALESCE(SUM(pr.success_redeem_request_amount), 0) AS success_redeem_request_amount,

          COALESCE(SUM(pr.failed_redeem_request_count), 0) AS failed_redeem_request_count,

          COALESCE(SUM(pr.failed_redeem_request_amount), 0) AS failed_redeem_request_amount
        FROM adjusted_intervals ai
        LEFT JOIN performance_report pr
          ON pr.from_date >= ai.report_day
          AND pr.to_date < ai.report_day + INTERVAL '1 day'
          AND pr.is_internal = ${isInternal}
        GROUP BY ai.report_day
        ORDER BY ai.report_day
      )

    SELECT
      (SELECT json_agg(t) FROM cumulative_data t) AS "groupedReport",
      (SELECT json_agg(t1) FROM today_grouped_report t1) AS "todayGroupedReport",
      (SELECT json_agg(t2) FROM missing_data t2) AS "missingData";
  `

      const result = await this.context.sequelize.query(query, { logging: false })

      // for online player
      let onlinePlayers = 0
      const userIds = ((await Cache.keys(CACHE_STORE_PREFIXES.SESSION)) || [])
        .map(s => Number(s.slice(s.lastIndexOf(':') + 1)))
        .filter(id => !Number.isNaN(id))

      if (userIds?.length) {
        const values = userIds.map(id => `(${id})`).join(', ')
        const onlinePlayerQuery = `
          WITH online_users(user_id) AS (
            VALUES ${values}
          )
          SELECT COUNT(*) AS non_internal_count
          FROM online_users ou
          WHERE 1=1
          ${isInternal
            ? `AND EXISTS (
            SELECT 1
            FROM public.user_tags ut
            JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = ou.user_id AND tg.tag = 'INTERNAL'
          )`
            : `AND NOT EXISTS (
          SELECT 1
          FROM public.user_tags ut
          JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = ou.user_id AND tg.tag = 'INTERNAL'
          )`}
        `;
        ([[{ non_internal_count: onlinePlayers }]] = await this.context.sequelize.query(onlinePlayerQuery, { logging: false }))
      }

      const purchaseAmountQuery = `WITH date_intervals AS (
        SELECT
          generate_series(
            '${fromDate}'::timestamp,
            '${toDate}'::timestamp,
            '1 day'::interval
          ) AS start_time
      )
      SELECT
        di.start_time AS date,
        COALESCE(SUM(t.amount), 0) AS total_purchase_amount
      FROM
        date_intervals di
      LEFT JOIN
        ledgers l
        ON l.created_at >= di.start_time
        AND l.created_at < di.start_time + interval '1 day'
        AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_COIN}'
        AND l.currency_id = ${CURRENCY.PSC}
      LEFT JOIN
        transactions t
        ON t.id = l.transaction_id
      WHERE 1=1
      ${isInternal
          ? `AND EXISTS (
            SELECT 1
            FROM public.user_tags ut
            INNER JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = t.user_id
            AND tg.tag = 'INTERNAL'
            AND ut.updated_at <= l.created_at
          )`
          : `AND NOT EXISTS (
            SELECT 1
            FROM public.user_tags ut
            INNER JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = t.user_id
            AND tg.tag = 'INTERNAL'
            AND ut.updated_at <= l.created_at
          )`}
      GROUP BY
        di.start_time
      ORDER BY
        di.start_time;
      `

      promises.push(this.context.sequelize.query(purchaseAmountQuery, { type: this.context.sequelize.QueryTypes.SELECT }))

      const walletsDataQuery = `
      SELECT
      (EXISTS (
        SELECT 1
        FROM public.user_tags ut
        INNER JOIN public.tags tg ON ut.tag_id = tg.id
        WHERE ut.user_id = w.user_id
        AND tg.tag = 'INTERNAL'
      )) AS is_internal,
      ROUND(SUM(w.amount)::numeric, 2) AS "totalSCAmount",
      ROUND(SUM(CASE
                WHEN c.code = '${SWEEPS_COINS.BSC}' THEN w.amount
                ELSE 0
            END)::numeric, 2) AS "totalBSCAmount",
      ROUND(SUM(CASE
                WHEN c.code = '${SWEEPS_COINS.PSC}' THEN w.amount
                ELSE 0
            END)::numeric, 2) AS "totalPSCAmount",
      ROUND(SUM(CASE
                WHEN c.code = '${SWEEPS_COINS.RSC}' THEN w.amount
                ELSE 0
            END)::numeric, 2) AS "totalRSCAmount"
      FROM wallets w
      JOIN currencies AS c ON w.currency_id = c.id
      WHERE c.type = '${CURRENCY_TYPES.SWEEP_COIN}'
      GROUP BY is_internal
      `
      promises.push(this.context.sequelize.query(walletsDataQuery, { type: this.context.sequelize.QueryTypes.SELECT }))
      const [totalPurchaseAmount, walletsSCData] = await Promise.all(promises)

      let updatedWalletsSCData = {}
      walletsSCData?.map((data) => {
        if (data.is_internal === isInternal) { updatedWalletsSCData = data }
        return null
      })

      return { performanceReportData: result[0][0].groupedReport || [], todayReportData: result[0][0].todayGroupedReport || [], misisngData: result[0][0].missingData || [], onlinePlayers, walletsSCData: updatedWalletsSCData, totalPurchaseAmount }
    } catch (err) {
      throw new APIError(err)
    }
  }
}
