import { sequelize } from '@src/database'
import { Logger } from '@src/libs/logger'
import { ServiceBase } from '@src/libs/serviceBase'
import { CURRENCY_CODE, LEDGER_PURPOSE, WITHDRAWAL_STATUS, CURRENCY } from '@src/utils/constants/public.constants.utils'

export class PerformanceReportService extends ServiceBase {
  async run () {
    try {
      const query = `WITH time_intervals AS (
        SELECT
        DATE_TRUNC('minute', NOW()) - INTERVAL '15 minutes' AS from_date,
        DATE_TRUNC('minute', NOW()) AS to_date
      ),
      bonus_data AS (
        SELECT
        (EXISTS (
          SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = w.user_id
          AND tg.tag = 'INTERNAL'
          AND ut.updated_at <= l.created_at
        )) AS is_internal,
        ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_SC}') AND l.currency_id = ${CURRENCY.BSC} ) AS NUMERIC), 2) AS "scRewards",

        COUNT(*) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_SC}') AND l.currency_id = ${CURRENCY.BSC}) AS "scRewardsCount",

        ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_GC}') AND l.currency_id = ${CURRENCY.GC} ) AS NUMERIC), 2) AS "gcRewards",

        COUNT(*) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_GC}') AND l.currency_id = ${CURRENCY.GC}) AS "gcRewardsCount"

        FROM ledgers AS l
        JOIN wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
        WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_SC}')
        AND l.created_at >= (SELECT from_date FROM time_intervals)
        AND l.created_at < (SELECT to_date FROM time_intervals)
        GROUP BY is_internal
      ),
      purchase_data AS (
        SELECT
        (EXISTS (
          SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = w.user_id
          AND tg.tag = 'INTERNAL'
          AND ut.updated_at <= l.created_at
        )) AS is_internal,
        COUNT(*) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_COIN}', '${LEDGER_PURPOSE.PURCHASE_SC_COIN}')) AS "purchaseCount",
        SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_COIN}', '${LEDGER_PURPOSE.PURCHASE_SC_COIN}')) AS "purchaseAmount",
        SUM(l.amount) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_COIN}' AND c.code = '${CURRENCY_CODE.GC}') AS "purchaseGcAmount",
        COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_COIN}' AND c.code = '${CURRENCY_CODE.GC}') AS "purchaseGcCount",
        SUM(l.amount) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_COIN}' AND c.code = '${CURRENCY_CODE.PSC}') AS "pscAmount",
        COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_COIN}' AND c.code = '${CURRENCY_CODE.PSC}') AS "pscCount",
        SUM(l.amount) FILTER (WHERE c.code = '${CURRENCY_CODE.GC}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_BONUS}') AS "bonusGcAmount",
        COUNT(*) FILTER (WHERE c.code = '${CURRENCY_CODE.GC}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_BONUS}') AS "bonusGcCount",
        SUM(l.amount) FILTER (WHERE c.code = '${CURRENCY_CODE.BSC}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}') AS "bonusBscAmount",
        COUNT(*) FILTER (WHERE c.code = '${CURRENCY_CODE.BSC}' AND l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}') AS "bonusBscCount"
        FROM ledgers AS l
        JOIN currencies c ON c.id = l.currency_id
        JOIN wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
        WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_COIN}', '${LEDGER_PURPOSE.PURCHASE_SC_COIN}', '${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}')
        AND c.code IN ('${CURRENCY_CODE.GC}', '${CURRENCY_CODE.PSC}', '${CURRENCY_CODE.BSC}')
        AND l.created_at >= (SELECT from_date FROM time_intervals)
        AND l.created_at < (SELECT to_date FROM time_intervals)
        GROUP BY is_internal
      ),
      casino_data AS (
        SELECT
        (EXISTS (
          SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = ct.user_id
          AND tg.tag = 'INTERNAL'
          AND ut.updated_at <= ct.created_at
        )) AS is_internal,
        ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND c.code = '${CURRENCY_CODE.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS "gcTotalBetAmount",
        COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND c.code = '${CURRENCY_CODE.GC}' THEN l.id ELSE NULL END) AS "gcTotalBetCount",
        ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND c.code IN ('${CURRENCY_CODE.BSC}', '${CURRENCY_CODE.PSC}', '${CURRENCY_CODE.RSC}') THEN l.amount ELSE 0 END)::NUMERIC, 2) AS "scStakedAmount",
        COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND c.code IN ('${CURRENCY_CODE.BSC}', '${CURRENCY_CODE.PSC}', '${CURRENCY_CODE.RSC}') THEN l.id ELSE NULL END) AS "scTotalBetCount",
        ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND c.code IN ('${CURRENCY_CODE.BSC}', '${CURRENCY_CODE.PSC}', '${CURRENCY_CODE.RSC}') THEN l.amount ELSE 0 END)::NUMERIC, 2) AS "scCasinoWins",
        ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND c.code = '${CURRENCY_CODE.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS "gcCasinoWins",
        ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND c.code = '${CURRENCY_CODE.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS "gcCasinoBetRollback",
        COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND c.code = '${CURRENCY_CODE.GC}') AS "gcCasinoBetRollbackCount",
        ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND c.code != '${CURRENCY_CODE.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS "scCasinoBetRollback",
        COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND c.code != '${CURRENCY_CODE.GC}') AS "scCasinoBetRollbackCount",
        ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND c.code = '${CURRENCY_CODE.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS "gcCasinoWinRollback",
        ROUND(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND c.code != '${CURRENCY_CODE.GC}' THEN l.amount ELSE 0 END)::NUMERIC, 2) AS "scCasinoWinRollback",
        COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND c.code IN ('${CURRENCY_CODE.BSC}', '${CURRENCY_CODE.PSC}', '${CURRENCY_CODE.RSC}')) AS "scTotalWinCount",
        COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND c.code = '${CURRENCY_CODE.GC}') AS "gcTotalWinCount",
        COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND c.code = '${CURRENCY_CODE.GC}') AS "gcCasinoWinRollbackCount",
        COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND c.code != '${CURRENCY_CODE.GC}') AS "scCasinoWinRollbackCount"
        FROM casino_transactions ct
        JOIN ledgers l ON ct.id = l.transaction_id
        JOIN currencies c ON c.id = l.currency_id
        WHERE l.purpose IN ('${LEDGER_PURPOSE.CASINO_BET}', '${LEDGER_PURPOSE.CASINO_WIN}', '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}', '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}')
        AND c.code IN ('${CURRENCY_CODE.GC}', '${CURRENCY_CODE.PSC}', '${CURRENCY_CODE.BSC}', '${CURRENCY_CODE.RSC}')
        AND ct.created_at >= (SELECT from_date FROM time_intervals)
        AND ct.created_at < (SELECT to_date FROM time_intervals)
        GROUP BY is_internal
      ),
      redeem_data AS (
          SELECT
          (EXISTS (
          SELECT 1
            FROM public.user_tags ut
            INNER JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = w.user_id
            AND tg.tag = 'INTERNAL'
            AND ut.updated_at <= w.updated_at
        )) AS is_internal,
          COUNT(CASE WHEN w.status = '${WITHDRAWAL_STATUS.APPROVED}' THEN w.id END) AS "successRedeemRequestCount",
          SUM(CASE WHEN w.status = '${WITHDRAWAL_STATUS.APPROVED}' THEN w.amount ELSE 0 END) AS "successRedeemRequestAmount",
          COUNT(CASE WHEN w.status = '${WITHDRAWAL_STATUS.FAILED}' THEN w.id END) AS "failedRedeemRequestCount",
          SUM(CASE WHEN w.status = '${WITHDRAWAL_STATUS.FAILED}' THEN w.amount ELSE 0 END) AS "failedRedeemRequestAmount",
          COUNT(CASE WHEN w.status = '${WITHDRAWAL_STATUS.REJECTED}' THEN w.id END) AS "rejectedRedeemRequestCount",
          SUM(CASE WHEN w.status = '${WITHDRAWAL_STATUS.REJECTED}' THEN w.amount ELSE 0 END) AS "rejectedRedeemRequestAmount"
          FROM withdrawals w
          WHERE w.status IN ('${WITHDRAWAL_STATUS.APPROVED}', '${WITHDRAWAL_STATUS.FAILED}', '${WITHDRAWAL_STATUS.REJECTED}')
          AND w.updated_at >= (SELECT from_date FROM time_intervals)
          AND w.updated_at < (SELECT to_date FROM time_intervals)
          GROUP BY is_internal
      ),
      distinct_is_internal AS (
        SELECT is_internal FROM purchase_data WHERE is_internal IS NOT NULL
        UNION
        SELECT is_internal FROM bonus_data WHERE is_internal IS NOT NULL
        UNION
        SELECT is_internal FROM redeem_data WHERE is_internal IS NOT NULL
        UNION
        SELECT is_internal FROM casino_data WHERE is_internal IS NOT NULL
      )
      INSERT INTO performance_report (
          from_date,
          to_date,
          is_internal,
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
          failed_redeem_request_count,
          failed_redeem_request_amount,
          rejected_redeem_request_amount,
          rejected_redeem_request_count,
          success_redeem_request_count,
          success_redeem_request_amount,
          sc_rewards,
          sc_rewards_count,
          gc_rewards,
          gc_rewards_count,
          created_at,
          updated_at
      )
      SELECT
      ti.from_date,
      ti.to_date,
      di.is_internal,
      COALESCE(pd."purchaseCount", 0),
      COALESCE(pd."purchaseAmount", 0),
      COALESCE(pd."purchaseGcAmount", 0),
      COALESCE(pd."purchaseGcCount", 0),
      COALESCE(pd."pscAmount", 0),
      COALESCE(pd."pscCount", 0),
      COALESCE(pd."bonusGcAmount", 0),
      COALESCE(pd."bonusGcCount", 0),
      COALESCE(pd."bonusBscAmount", 0),
      COALESCE(pd."bonusBscCount", 0),
      COALESCE(cd."gcTotalBetAmount", 0),
      COALESCE(cd."gcTotalBetCount", 0),
      COALESCE(cd."gcCasinoWins", 0) AS "gcTotalWinAmount",
      COALESCE(cd."gcTotalWinCount", 0) AS "gcTotalWinCount",
      COALESCE(cd."scStakedAmount", 0) AS "scTotalBetAmount",
      COALESCE(cd."scTotalBetCount", 0) AS "scTotalBetCount",
      COALESCE(cd."scCasinoWins", 0) AS "scTotalWinAmount",
      COALESCE(cd."scTotalWinCount", 0) AS "scTotalWinCount",
      COALESCE(cd."gcCasinoBetRollback", 0) AS "gcCasinoBetRollback",
      COALESCE(cd."gcCasinoBetRollbackCount", 0) AS "gcCasinoBetRollbackCount",
      COALESCE(cd."scCasinoBetRollback", 0) AS "scCasinoBetRollback",
      COALESCE(cd."scCasinoBetRollbackCount", 0) AS "scCasinoBetRollbackCount",
      COALESCE(cd."gcCasinoWinRollback", 0) AS "gcCasinoWinRollback",
      COALESCE(cd."gcCasinoWinRollbackCount", 0) AS "gcCasinoWinRollbackCount",
      COALESCE(cd."scCasinoWinRollback", 0) AS "scCasinoWinRollback",
      COALESCE(cd."scCasinoWinRollbackCount", 0) AS "scCasinoWinRollbackCount",
      COALESCE(rd."failedRedeemRequestCount", 0),
      COALESCE(rd."failedRedeemRequestAmount", 0),
      COALESCE(rd."rejectedRedeemRequestAmount", 0),
      COALESCE(rd."rejectedRedeemRequestCount", 0),
      COALESCE(rd."successRedeemRequestCount", 0),
      COALESCE(rd."successRedeemRequestAmount", 0),
      COALESCE(bd."scRewards", 0),
      COALESCE(bd."scRewardsCount", 0),
      COALESCE(bd."gcRewards", 0),
      COALESCE(bd."gcRewardsCount", 0),
      NOW() AS created_at,
      NOW() AS updated_at
      FROM time_intervals ti
      LEFT JOIN distinct_is_internal di ON 1=1
      LEFT JOIN purchase_data pd ON pd.is_internal = di.is_internal
      LEFT JOIN casino_data cd ON cd.is_internal = di.is_internal
      LEFT JOIN redeem_data rd ON rd.is_internal = di.is_internal
      LEFT JOIN bonus_data bd ON bd.is_internal = di.is_internal
      ON CONFLICT (from_date, to_date, is_internal) DO NOTHING;

    `
      await sequelize.query(query)
      return { success: true }
    } catch (error) {
      Logger.error('Performance Report Service', { message: 'Error in performance report Service', exception: error })
      return { success: false, message: 'Error in performance report Service', data: null, error }
    }
  }
}
