import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { serverDayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { REPORT_TIME_PERIOD_FILTER, CACHE_STORE_PREFIXES } from '@src/utils/constants/app.constants'
import { LEDGER_PURPOSE, SWEEPS_COINS, WITHDRAWAL_STATUS, CURRENCY } from '@src/utils/constants/public.constants.utils'
import { Cache } from '@src/libs/cache'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    currencyId: { type: 'string' },
    toDate: { type: 'string', default: serverDayjs().startOf('day') },
    fromDate: { type: 'string', default: serverDayjs().subtract(90, 'day') },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM }
  }
})

export class GetStatsSummaryV2Service extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { fromDate, toDate } = this.args

    try {
      const query = `
    WITH performance_report_data AS (
        SELECT id,
            purchase_count,
            purchase_amount,
            purchase_gc_amount,
            purchase_gc_count,
            psc_amount,
            psc_count,
            bonus_gc_amount,
            bonus_gc_count,
            bonus_bsc_amount,
            bonus_bsc_count,
            gc_total_bet_amount,
            gc_total_bet_count,
            gc_total_win_amount,
            gc_total_win_count,
            sc_total_bet_amount,
            sc_total_bet_count,
            sc_total_win_amount,
            sc_total_win_count,
            gc_casino_bet_rollback,
            gc_casino_bet_rollback_count,
            sc_casino_bet_rollback,
            sc_casino_bet_rollback_count,
            gc_casino_win_rollback,
            gc_casino_win_rollback_count,
            sc_casino_win_rollback,
            sc_casino_win_rollback_count,
            rejected_redeem_request_amount,
            rejected_redeem_request_count,
            failed_redeem_request_count,
            failed_redeem_request_amount,
            success_redeem_request_count,
            success_redeem_request_amount,
            sc_rewards,
            sc_rewards_count,
            gc_rewards,
            gc_rewards_count,
            from_date,
            to_date,
            created_at,
            updated_at
        FROM performance_report
        WHERE (DATE(from_date) >= '${fromDate}' AND DATE(to_date) <= '${toDate}')
    ),

    missing_bonus_data AS (
      SELECT
      ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_SC}') AND l.currency_id = ${CURRENCY.BSC} ) AS NUMERIC), 2) AS sc_rewards,

      COUNT(*) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_SC}') AND l.currency_id = ${CURRENCY.BSC}) AS sc_rewards_count,

      ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_GC}') AND l.currency_id = ${CURRENCY.GC} ) AS NUMERIC), 2) AS gc_rewards,

      COUNT(*) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_GC}') AND l.currency_id = ${CURRENCY.GC}) AS gc_rewards_count

      FROM ledgers AS l
      JOIN wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
      WHERE l.created_at > (SELECT COALESCE(MAX(to_date), '${fromDate}') FROM performance_report)
      AND l.created_at <= NOW()
      AND NOT EXISTS (
        SELECT 1
        FROM public.user_tags ut
        INNER JOIN public.tags tg ON ut.tag_id = tg.id
        WHERE ut.user_id = w.user_id
        AND tg.tag = 'INTERNAL'
      )
    ),

    missing_ledger_data AS (
        SELECT
            COUNT(*) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_COIN}', '${LEDGER_PURPOSE.PURCHASE_SC_COIN}')) AS purchase_count,
            SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_COIN}', '${LEDGER_PURPOSE.PURCHASE_SC_COIN}')) AS purchase_amount,
            SUM(l.amount) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_COIN}' AND c.code = '${SWEEPS_COINS.GC}') AS purchase_gc_amount,
            COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_COIN}' AND c.code = '${SWEEPS_COINS.GC}') AS purchase_gc_count,
            SUM(l.amount) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_COIN}' AND c.code = '${SWEEPS_COINS.PSC}') AS psc_amount,
            COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_COIN}' AND c.code = '${SWEEPS_COINS.PSC}') AS psc_count,
            SUM(l.amount) FILTER (WHERE c.code = '${SWEEPS_COINS.GC}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_BONUS}') AS bonus_gc_amount,
            COUNT(*) FILTER (WHERE c.code = '${SWEEPS_COINS.GC}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_BONUS}') AS bonus_gc_count,
            SUM(l.amount) FILTER (WHERE c.code = '${SWEEPS_COINS.BSC}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}') AS bonus_bsc_amount,
            COUNT(*) FILTER (WHERE c.code = '${SWEEPS_COINS.BSC}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}') AS bonus_bsc_count
        FROM ledgers AS l
        JOIN wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
        JOIN currencies c ON c.id = l.currency_id
        WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_COIN}', '${LEDGER_PURPOSE.PURCHASE_SC_COIN}', '${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}')
        AND c.code IN ('${SWEEPS_COINS.GC}', '${SWEEPS_COINS.PSC}', '${SWEEPS_COINS.BSC}')
        AND l.created_at > (SELECT COALESCE(MAX(to_date), '${fromDate}') FROM performance_report)
        AND l.created_at <= NOW()
        AND NOT EXISTS (
          SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = w.user_id
          AND tg.tag = 'INTERNAL'
        )
    ),

    missing_casino_data AS (
        SELECT
            ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND c.code = '${SWEEPS_COINS.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS gc_total_bet_amount,
            COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND c.code = '${SWEEPS_COINS.GC}' THEN l.id ELSE NULL END) AS gc_total_bet_count,
            ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND c.code = '${SWEEPS_COINS.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS gc_total_win_amount,
            ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND c.code IN ('${SWEEPS_COINS.BSC}', '${SWEEPS_COINS.PSC}', '${SWEEPS_COINS.RSC}') THEN l.amount ELSE 0 END)::NUMERIC, 2) AS sc_total_bet_amount,
            COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND c.code IN ('${SWEEPS_COINS.BSC}', '${SWEEPS_COINS.PSC}', '${SWEEPS_COINS.RSC}') THEN l.id ELSE NULL END) AS sc_total_bet_count,
            ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND c.code IN ('${SWEEPS_COINS.BSC}', '${SWEEPS_COINS.PSC}', '${SWEEPS_COINS.RSC}') THEN l.amount ELSE 0 END)::NUMERIC, 2) AS sc_total_win_amount,
            ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND c.code = '${SWEEPS_COINS.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS gc_casino_bet_rollback,
            COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND c.code = '${SWEEPS_COINS.GC}') AS gc_casino_bet_rollback_count,
            ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND c.code != '${SWEEPS_COINS.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS sc_casino_bet_rollback,
            COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND c.code != '${SWEEPS_COINS.GC}') AS sc_casino_bet_rollback_count,
            ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND c.code = '${SWEEPS_COINS.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS gc_casino_win_rollback,
            ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND c.code != '${SWEEPS_COINS.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS sc_casino_win_rollback,
            COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND c.code IN ('${SWEEPS_COINS.BSC}', '${SWEEPS_COINS.PSC}', '${SWEEPS_COINS.RSC}')) AS sc_total_win_count,
            COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND c.code = '${SWEEPS_COINS.GC}') AS gc_total_win_count,
            COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND c.code = '${SWEEPS_COINS.GC}') AS gc_casino_win_rollback_count,
            COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND c.code != '${SWEEPS_COINS.GC}') AS sc_casino_win_rollback_count
        FROM casino_transactions ct
        JOIN ledgers l ON ct.id = l.transaction_id
        JOIN currencies c ON c.id = l.currency_id
        WHERE l.purpose IN ('${LEDGER_PURPOSE.CASINO_BET}', '${LEDGER_PURPOSE.CASINO_WIN}', '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}', '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}')
        AND c.code IN ('${SWEEPS_COINS.GC}', '${SWEEPS_COINS.PSC}', '${SWEEPS_COINS.BSC}', '${SWEEPS_COINS.RSC}')
        AND l.created_at > (SELECT COALESCE(MAX(to_date), '${fromDate}') FROM performance_report)
        AND l.created_at <= NOW()
        AND NOT EXISTS (
          SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = ct.user_id
          AND tg.tag = 'INTERNAL'
        )
    ),

    missing_withdrawal_data AS (
        SELECT
            COUNT(CASE WHEN w.status = '${WITHDRAWAL_STATUS.REJECTED}' THEN w.id END) AS rejected_redeem_request_count,
            SUM(CASE WHEN w.status = '${WITHDRAWAL_STATUS.REJECTED}' THEN w.amount ELSE 0 END) AS rejected_redeem_request_amount,
            COUNT(CASE WHEN w.status = '${WITHDRAWAL_STATUS.APPROVED}' THEN w.id END) AS success_redeem_request_count,
            SUM(CASE WHEN w.status = '${WITHDRAWAL_STATUS.APPROVED}' THEN w.amount ELSE 0 END) AS success_redeem_request_amount,
            COUNT(CASE WHEN w.status = '${WITHDRAWAL_STATUS.FAILED}' THEN w.id END) AS failed_redeem_request_count,
            SUM(CASE WHEN w.status = '${WITHDRAWAL_STATUS.FAILED}' THEN w.amount ELSE 0 END) AS failed_redeem_request_amount
            FROM withdrawals w
            WHERE w.status IN ('${WITHDRAWAL_STATUS.APPROVED}', '${WITHDRAWAL_STATUS.FAILED}', '${WITHDRAWAL_STATUS.REJECTED}')
            AND w.updated_at > (SELECT COALESCE(MAX(to_date), '${fromDate}') FROM performance_report)
            AND w.updated_at <= NOW()
            AND NOT EXISTS (
              SELECT 1
              FROM public.user_tags ut
              INNER JOIN public.tags tg ON ut.tag_id = tg.id
              WHERE ut.user_id = w.user_id
              AND tg.tag = 'INTERNAL'
            )
    )

      SELECT
        prd.id,
        COALESCE(prd.purchase_count, 0) + COALESCE(mld.purchase_count, 0) AS purchase_count,
        COALESCE(prd.purchase_amount, 0) + COALESCE(mld.purchase_amount, 0) AS purchase_amount,
        COALESCE(prd.purchase_gc_amount, 0) + COALESCE(mld.purchase_gc_amount, 0) AS purchase_gc_amount,
        COALESCE(prd.purchase_gc_count, 0) + COALESCE(mld.purchase_gc_count, 0) AS purchase_gc_count,
        COALESCE(prd.psc_amount, 0) + COALESCE(mld.psc_amount, 0) AS psc_amount,
        COALESCE(prd.psc_count, 0) + COALESCE(mld.psc_count, 0) AS psc_count,
        COALESCE(prd.bonus_gc_amount, 0) + COALESCE(mld.bonus_gc_amount, 0) AS bonus_gc_amount,
        COALESCE(prd.bonus_gc_count, 0) + COALESCE(mld.bonus_gc_count, 0) AS bonus_gc_count,
        COALESCE(prd.bonus_bsc_amount, 0) + COALESCE(mld.bonus_bsc_amount, 0) AS bonus_bsc_amount,
        COALESCE(prd.bonus_bsc_count, 0) + COALESCE(mld.bonus_bsc_count, 0) AS bonus_bsc_count,
        COALESCE(prd.gc_total_bet_amount, 0) + COALESCE(mcd.gc_total_bet_amount, 0) AS gc_total_bet_amount,
        COALESCE(prd.gc_total_bet_count, 0) + COALESCE(mcd.gc_total_bet_count, 0) AS gc_total_bet_count,
        COALESCE(prd.gc_total_win_amount, 0) + COALESCE(mcd.gc_total_win_amount, 0) AS gc_total_win_amount,
        COALESCE(prd.gc_total_win_count, 0) + COALESCE(mcd.gc_total_win_count, 0) AS gc_total_win_count,
        COALESCE(prd.sc_total_bet_amount, 0) + COALESCE(mcd.sc_total_bet_amount, 0) AS sc_total_bet_amount,
        COALESCE(prd.sc_total_bet_count, 0) + COALESCE(mcd.sc_total_bet_count, 0) AS sc_total_bet_count,
        COALESCE(prd.sc_total_win_amount, 0) + COALESCE(mcd.sc_total_win_amount, 0) AS sc_total_win_amount,
        COALESCE(prd.sc_total_win_count, 0) + COALESCE(mcd.sc_total_win_count, 0) AS sc_total_win_count,
        COALESCE(prd.gc_casino_bet_rollback, 0) + COALESCE(mcd.gc_casino_bet_rollback, 0) AS gc_casino_bet_rollback,
        COALESCE(prd.gc_casino_bet_rollback_count, 0) + COALESCE(mcd.gc_casino_bet_rollback_count, 0) AS gc_casino_bet_rollback_count,
        COALESCE(prd.sc_casino_bet_rollback, 0) + COALESCE(mcd.sc_casino_bet_rollback, 0) AS sc_casino_bet_rollback,
        COALESCE(prd.sc_casino_bet_rollback_count, 0) + COALESCE(mcd.sc_casino_bet_rollback_count, 0) AS sc_casino_bet_rollback_count,
        COALESCE(prd.gc_casino_win_rollback, 0) + COALESCE(mcd.gc_casino_win_rollback, 0) AS gc_casino_win_rollback,
        COALESCE(prd.gc_casino_win_rollback_count, 0) + COALESCE(mcd.gc_casino_win_rollback_count, 0) AS gc_casino_win_rollback_count,
        COALESCE(prd.sc_casino_win_rollback, 0) + COALESCE(mcd.sc_casino_win_rollback, 0) AS sc_casino_win_rollback,
        COALESCE(prd.sc_casino_win_rollback_count, 0) + COALESCE(mcd.sc_casino_win_rollback_count, 0) AS sc_casino_win_rollback_count,
        COALESCE(prd.rejected_redeem_request_count, 0) + COALESCE(mwd.rejected_redeem_request_count, 0) AS rejected_redeem_request_count,
        COALESCE(prd.rejected_redeem_request_amount, 0) + COALESCE(mwd.rejected_redeem_request_amount, 0) AS rejected_redeem_request_amount,
        COALESCE(prd.success_redeem_request_count, 0) + COALESCE(mwd.success_redeem_request_count, 0) AS success_redeem_request_count,
        COALESCE(prd.success_redeem_request_amount, 0) + COALESCE(mwd.success_redeem_request_amount, 0) AS success_redeem_request_amount,
        COALESCE(prd.failed_redeem_request_count, 0) + COALESCE(mwd.failed_redeem_request_count, 0) AS failed_redeem_request_count,
        COALESCE(prd.failed_redeem_request_amount, 0) + COALESCE(mwd.failed_redeem_request_amount, 0) AS failed_redeem_request_amount,
        COALESCE(prd.sc_rewards, 0) + COALESCE(mbd.sc_rewards, 0) AS sc_rewards,
        COALESCE(prd.sc_rewards_count, 0) + COALESCE(mbd.sc_rewards_count, 0) AS sc_rewards_count,
        COALESCE(prd.gc_rewards, 0) + COALESCE(mbd.gc_rewards, 0) AS gc_rewards,
        COALESCE(prd.gc_rewards_count, 0) + COALESCE(mbd.gc_rewards_count, 0) AS gc_rewards_count,
        DATE(prd.from_date) AS from_date,
        DATE(prd.to_date) AS to_date
        FROM performance_report_data prd
        FULL OUTER JOIN missing_ledger_data mld ON TRUE
        FULL OUTER JOIN missing_casino_data mcd ON TRUE
        FULL OUTER JOIN missing_withdrawal_data mwd ON TRUE
        FULL OUTER JOIN missing_bonus_data mbd ON TRUE
      `
      const todayQueryData = `
      WITH performance_report_data AS (
          SELECT id,
              purchase_count,
              purchase_amount,
              purchase_gc_amount,
              purchase_gc_count,
              psc_amount,
              psc_count,
              bonus_gc_amount,
              bonus_gc_count,
              bonus_bsc_amount,
              bonus_bsc_count,
              gc_total_bet_amount,
              gc_total_bet_count,
              gc_total_win_amount,
              gc_total_win_count,
              sc_total_bet_amount,
              sc_total_bet_count,
              sc_total_win_amount,
              sc_total_win_count,
              gc_casino_bet_rollback,
              gc_casino_bet_rollback_count,
              sc_casino_bet_rollback,
              sc_casino_bet_rollback_count,
              gc_casino_win_rollback,
              gc_casino_win_rollback_count,
              sc_casino_win_rollback,
              sc_casino_win_rollback_count,
              rejected_redeem_request_amount,
              rejected_redeem_request_count,
              failed_redeem_request_count,
              failed_redeem_request_amount,
              success_redeem_request_count,
              success_redeem_request_amount,
              sc_rewards,
              sc_rewards_count,
              gc_rewards,
              gc_rewards_count,
              from_date,
              to_date,
              created_at,
              updated_at
          FROM performance_report
          WHERE DATE(to_date) = CURRENT_DATE
      ),

      missing_bonus_data AS (
        SELECT
        ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_SC}') AND l.currency_id = ${CURRENCY.BSC} ) AS NUMERIC), 2) AS sc_rewards,

        COUNT(*) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_SC}') AND l.currency_id = ${CURRENCY.BSC}) AS sc_rewards_count,

        ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_GC}') AND l.currency_id = ${CURRENCY.GC} ) AS NUMERIC), 2) AS gc_rewards,

        COUNT(*) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_GC}') AND l.currency_id = ${CURRENCY.GC}) AS gc_rewards_count

        FROM ledgers AS l
        JOIN wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
        WHERE l.created_at = CURRENT_DATE
        AND NOT EXISTS (
          SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = w.user_id
          AND tg.tag = 'INTERNAL'
        )
      ),

      missing_ledger_data AS (
          SELECT
              COUNT(*) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_COIN}', '${LEDGER_PURPOSE.PURCHASE_SC_COIN}')) AS purchase_count,
              SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_COIN}', '${LEDGER_PURPOSE.PURCHASE_SC_COIN}')) AS purchase_amount,
              SUM(l.amount) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_COIN}' AND c.code = '${SWEEPS_COINS.GC}') AS purchase_gc_amount,
              COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_COIN}' AND c.code = '${SWEEPS_COINS.GC}') AS purchase_gc_count,
              SUM(l.amount) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_COIN}' AND c.code = '${SWEEPS_COINS.PSC}') AS psc_amount,
              COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_COIN}' AND c.code = '${SWEEPS_COINS.PSC}') AS psc_count,
              SUM(l.amount) FILTER (WHERE c.code = '${SWEEPS_COINS.GC}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_BONUS}') AS bonus_gc_amount,
              COUNT(*) FILTER (WHERE c.code = '${SWEEPS_COINS.GC}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_BONUS}') AS bonus_gc_count,
              SUM(l.amount) FILTER (WHERE c.code = '${SWEEPS_COINS.BSC}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}') AS bonus_bsc_amount,
              COUNT(*) FILTER (WHERE c.code = '${SWEEPS_COINS.BSC}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}') AS bonus_bsc_count
          FROM ledgers AS l
          JOIN wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
          JOIN currencies c ON c.id = l.currency_id
          WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_COIN}', '${LEDGER_PURPOSE.PURCHASE_SC_COIN}', '${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}')
          AND c.code IN ('${SWEEPS_COINS.GC}', '${SWEEPS_COINS.PSC}', '${SWEEPS_COINS.BSC}')
          AND l.created_at = CURRENT_DATE
          AND NOT EXISTS (
            SELECT 1
            FROM public.user_tags ut
            INNER JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = w.user_id
            AND tg.tag = 'INTERNAL'
          )
      ),

      missing_casino_data AS (
          SELECT
              ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND c.code = '${SWEEPS_COINS.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS gc_total_bet_amount,
              COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND c.code = '${SWEEPS_COINS.GC}' THEN l.id ELSE NULL END) AS gc_total_bet_count,
              ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND c.code = '${SWEEPS_COINS.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS gc_total_win_amount,
              ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND c.code IN ('${SWEEPS_COINS.BSC}', '${SWEEPS_COINS.PSC}', '${SWEEPS_COINS.RSC}') THEN l.amount ELSE 0 END)::NUMERIC, 2) AS sc_total_bet_amount,
              COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND c.code IN ('${SWEEPS_COINS.BSC}', '${SWEEPS_COINS.PSC}', '${SWEEPS_COINS.RSC}') THEN l.id ELSE NULL END) AS sc_total_bet_count,
              ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND c.code IN ('${SWEEPS_COINS.BSC}', '${SWEEPS_COINS.PSC}', '${SWEEPS_COINS.RSC}') THEN l.amount ELSE 0 END)::NUMERIC, 2) AS sc_total_win_amount,
              ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND c.code = '${SWEEPS_COINS.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS gc_casino_bet_rollback,
              COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND c.code = '${SWEEPS_COINS.GC}') AS gc_casino_bet_rollback_count,
              ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND c.code != '${SWEEPS_COINS.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS sc_casino_bet_rollback,
              COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND c.code != '${SWEEPS_COINS.GC}') AS sc_casino_bet_rollback_count,
              ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND c.code = '${SWEEPS_COINS.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS gc_casino_win_rollback,
              ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND c.code != '${SWEEPS_COINS.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS sc_casino_win_rollback,
              COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND c.code IN ('${SWEEPS_COINS.BSC}', '${SWEEPS_COINS.PSC}', '${SWEEPS_COINS.RSC}')) AS sc_total_win_count,
              COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND c.code = '${SWEEPS_COINS.GC}') AS gc_total_win_count,
              COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND c.code = '${SWEEPS_COINS.GC}') AS gc_casino_win_rollback_count,
              COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND c.code != '${SWEEPS_COINS.GC}') AS sc_casino_win_rollback_count
          FROM casino_transactions ct
          JOIN ledgers l ON ct.id = l.transaction_id
          JOIN currencies c ON c.id = l.currency_id
          WHERE l.purpose IN ('${LEDGER_PURPOSE.CASINO_BET}', '${LEDGER_PURPOSE.CASINO_WIN}', '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}', '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}')
          AND c.code IN ('${SWEEPS_COINS.GC}', '${SWEEPS_COINS.PSC}', '${SWEEPS_COINS.BSC}', '${SWEEPS_COINS.RSC}')
          AND l.created_at = CURRENT_DATE
          AND NOT EXISTS (
            SELECT 1
            FROM public.user_tags ut
            INNER JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = ct.user_id
            AND tg.tag = 'INTERNAL'
          )
      ),

      missing_withdrawal_data AS (
          SELECT
              COUNT(CASE WHEN w.status = '${WITHDRAWAL_STATUS.REJECTED}' THEN w.id END) AS rejected_redeem_request_count,
              SUM(CASE WHEN w.status = '${WITHDRAWAL_STATUS.REJECTED}' THEN w.amount ELSE 0 END) AS rejected_redeem_request_amount,
              COUNT(CASE WHEN w.status = '${WITHDRAWAL_STATUS.APPROVED}' THEN w.id END) AS success_redeem_request_count,
              SUM(CASE WHEN w.status = '${WITHDRAWAL_STATUS.APPROVED}' THEN w.amount ELSE 0 END) AS success_redeem_request_amount,
              COUNT(CASE WHEN w.status = '${WITHDRAWAL_STATUS.FAILED}' THEN w.id END) AS failed_redeem_request_count,
              SUM(CASE WHEN w.status = '${WITHDRAWAL_STATUS.FAILED}' THEN w.amount ELSE 0 END) AS failed_redeem_request_amount
              FROM withdrawals w
              WHERE w.status IN ('${WITHDRAWAL_STATUS.APPROVED}', '${WITHDRAWAL_STATUS.FAILED}', '${WITHDRAWAL_STATUS.REJECTED}')
              AND w.created_at = CURRENT_DATE
              AND NOT EXISTS (
                SELECT 1
                FROM public.user_tags ut
                INNER JOIN public.tags tg ON ut.tag_id = tg.id
                WHERE ut.user_id = w.user_id
                AND tg.tag = 'INTERNAL'
              )
      )

        SELECT
          prd.id,
          COALESCE(prd.purchase_count, 0) + COALESCE(mld.purchase_count, 0) AS purchase_count,
          COALESCE(prd.purchase_amount, 0) + COALESCE(mld.purchase_amount, 0) AS purchase_amount,
          COALESCE(prd.purchase_gc_amount, 0) + COALESCE(mld.purchase_gc_amount, 0) AS purchase_gc_amount,
          COALESCE(prd.purchase_gc_count, 0) + COALESCE(mld.purchase_gc_count, 0) AS purchase_gc_count,
          COALESCE(prd.psc_amount, 0) + COALESCE(mld.psc_amount, 0) AS psc_amount,
          COALESCE(prd.psc_count, 0) + COALESCE(mld.psc_count, 0) AS psc_count,
          COALESCE(prd.bonus_gc_amount, 0) + COALESCE(mld.bonus_gc_amount, 0) AS bonus_gc_amount,
          COALESCE(prd.bonus_gc_count, 0) + COALESCE(mld.bonus_gc_count, 0) AS bonus_gc_count,
          COALESCE(prd.bonus_bsc_amount, 0) + COALESCE(mld.bonus_bsc_amount, 0) AS bonus_bsc_amount,
          COALESCE(prd.bonus_bsc_count, 0) + COALESCE(mld.bonus_bsc_count, 0) AS bonus_bsc_count,
          COALESCE(prd.gc_total_bet_amount, 0) + COALESCE(mcd.gc_total_bet_amount, 0) AS gc_total_bet_amount,
          COALESCE(prd.gc_total_bet_count, 0) + COALESCE(mcd.gc_total_bet_count, 0) AS gc_total_bet_count,
          COALESCE(prd.gc_total_win_amount, 0) + COALESCE(mcd.gc_total_win_amount, 0) AS gc_total_win_amount,
          COALESCE(prd.gc_total_win_count, 0) + COALESCE(mcd.gc_total_win_count, 0) AS gc_total_win_count,
          COALESCE(prd.sc_total_bet_amount, 0) + COALESCE(mcd.sc_total_bet_amount, 0) AS sc_total_bet_amount,
          COALESCE(prd.sc_total_bet_count, 0) + COALESCE(mcd.sc_total_bet_count, 0) AS sc_total_bet_count,
          COALESCE(prd.sc_total_win_amount, 0) + COALESCE(mcd.sc_total_win_amount, 0) AS sc_total_win_amount,
          COALESCE(prd.sc_total_win_count, 0) + COALESCE(mcd.sc_total_win_count, 0) AS sc_total_win_count,
          COALESCE(prd.gc_casino_bet_rollback, 0) + COALESCE(mcd.gc_casino_bet_rollback, 0) AS gc_casino_bet_rollback,
          COALESCE(prd.gc_casino_bet_rollback_count, 0) + COALESCE(mcd.gc_casino_bet_rollback_count, 0) AS gc_casino_bet_rollback_count,
          COALESCE(prd.sc_casino_bet_rollback, 0) + COALESCE(mcd.sc_casino_bet_rollback, 0) AS sc_casino_bet_rollback,
          COALESCE(prd.sc_casino_bet_rollback_count, 0) + COALESCE(mcd.sc_casino_bet_rollback_count, 0) AS sc_casino_bet_rollback_count,
          COALESCE(prd.gc_casino_win_rollback, 0) + COALESCE(mcd.gc_casino_win_rollback, 0) AS gc_casino_win_rollback,
          COALESCE(prd.gc_casino_win_rollback_count, 0) + COALESCE(mcd.gc_casino_win_rollback_count, 0) AS gc_casino_win_rollback_count,
          COALESCE(prd.sc_casino_win_rollback, 0) + COALESCE(mcd.sc_casino_win_rollback, 0) AS sc_casino_win_rollback,
          COALESCE(prd.sc_casino_win_rollback_count, 0) + COALESCE(mcd.sc_casino_win_rollback_count, 0) AS sc_casino_win_rollback_count,
          COALESCE(prd.rejected_redeem_request_count, 0) + COALESCE(mwd.rejected_redeem_request_count, 0) AS rejected_redeem_request_count,
          COALESCE(prd.rejected_redeem_request_amount, 0) + COALESCE(mwd.rejected_redeem_request_amount, 0) AS rejected_redeem_request_amount,
          COALESCE(prd.success_redeem_request_count, 0) + COALESCE(mwd.success_redeem_request_count, 0) AS success_redeem_request_count,
          COALESCE(prd.success_redeem_request_amount, 0) + COALESCE(mwd.success_redeem_request_amount, 0) AS success_redeem_request_amount,
          COALESCE(prd.failed_redeem_request_count, 0) + COALESCE(mwd.failed_redeem_request_count, 0) AS failed_redeem_request_count,
          COALESCE(prd.failed_redeem_request_amount, 0) + COALESCE(mwd.failed_redeem_request_amount, 0) AS failed_redeem_request_amount,
          COALESCE(prd.sc_rewards, 0) + COALESCE(mbd.sc_rewards, 0) AS sc_rewards,
          COALESCE(prd.sc_rewards_count, 0) + COALESCE(mbd.sc_rewards_count, 0) AS sc_rewards_count,
          COALESCE(prd.gc_rewards, 0) + COALESCE(mbd.gc_rewards, 0) AS gc_rewards,
          COALESCE(prd.gc_rewards_count, 0) + COALESCE(mbd.gc_rewards_count, 0) AS gc_rewards_count,
          DATE(prd.from_date) AS from_date,
          DATE(prd.to_date) AS to_date
          FROM performance_report_data prd
          FULL OUTER JOIN missing_ledger_data mld ON TRUE
          FULL OUTER JOIN missing_casino_data mcd ON TRUE
          FULL OUTER JOIN missing_withdrawal_data mwd ON TRUE
          FULL OUTER JOIN missing_bonus_data mbd ON TRUE
        `
      const [data] = await this.context.sequelize.query(query, { logging: false })
      const [todayData] = await this.context.sequelize.query(todayQueryData, { logging: false })
      const reportData = data || []
      const todayReportData = todayData || []
      // Calculate overall sums for each field
      const overallTotals = reportData.reduce((totals, item) => {
        Object.keys(item).forEach((key) => {
          if (typeof item[key] === 'number' || !isNaN(Number(item[key]))) {
            const totalKey = `total_${key}`
            totals[totalKey] = (totals[totalKey] || 0) + Number(item[key])
          }
        })
        return totals
      }, {})
      const groupedReport = reportData.reduce((acc, curr) => {
        const key = curr.from_date
        if (!acc[key]) {
          acc[key] = { ...curr }
          Object.keys(acc[key]).forEach(k => {
            if (!isNaN(acc[key][k]) && k !== 'id') {
              acc[key][k] = Number(acc[key][k])
            }
          })
        } else {
          Object.keys(curr).forEach(k => {
            if (!isNaN(curr[k]) && k !== 'id' && k !== 'from_date' && k !== 'to_date') {
              acc[key][k] += Number(curr[k])
            }
          })
        }
        return acc
      }, {})
      const today = new Date().toISOString().split('T')[0] // Get today's date (YYYY-MM-DD format)

      // Filter only today's records
      const filteredTodayData = todayReportData.filter(curr => curr.from_date === today)

      const todayGroupedReport = filteredTodayData.reduce((acc, curr) => {
        const key = curr.from_date

        if (!acc[key]) {
          acc[key] = { ...curr }
          Object.keys(acc[key]).forEach(k => {
            if (!isNaN(acc[key][k]) && k !== 'id') {
              acc[key][k] = Number(acc[key][k])
            }
          })
        } else {
          Object.keys(curr).forEach(k => {
            if (!isNaN(curr[k]) && k !== 'id' && k !== 'from_date' && k !== 'to_date') {
              acc[key][k] += Number(curr[k])
            }
          })
        }

        return acc
      }, {})

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
          WHERE NOT EXISTS (
            SELECT 1
            FROM public.user_tags ut
            JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = ou.user_id AND tg.tag = 'INTERNAL'
          )
        `;
        ([[{ non_internal_count: onlinePlayers }]] = await this.context.sequelize.query(onlinePlayerQuery, { logging: false }))
      }

      return { performanceReportData: groupedReport, todayReportData: todayGroupedReport, overallCountAmount: overallTotals, onlinePlayers }
    } catch (err) {
      throw new APIError(err)
    }
  }
}
