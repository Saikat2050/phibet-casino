import { sequelize } from '@src/database'
import { ServiceBase } from '@src/libs/serviceBase'
import { LEDGER_PURPOSE, CURRENCY, WITHDRAWAL_STATUS } from '@src/utils/constants/public.constants.utils'
import { LEDGER_TRANSACTION_TYPE } from '@src/utils/constants/payment.constants'

export class CumulativePlayerReportService extends ServiceBase {
  async run () {
    try {
      const query = `
        WITH time_intervals AS (
          SELECT
            DATE_TRUNC('minute', NOW()) - INTERVAL '15 minutes' AS from_date,
            DATE_TRUNC('minute', NOW()) AS till_date
        ),
        playerStatistics AS (
          SELECT
            u.id AS user_id,
            (EXISTS (
              SELECT 1
              FROM public.user_tags ut
              INNER JOIN public.tags tg ON ut.tag_id = tg.id
              WHERE ut.user_id = u.id
              AND tg.tag = 'INTERNAL'
              AND ut.updated_at <= l.created_at
            )) AS is_internal,

            ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS gc_staked_amount,

            COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id = ${CURRENCY.GC} THEN l.id ELSE NULL END) AS gc_bet_count,

            ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id != ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS sc_staked_amount,

            COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id != ${CURRENCY.GC} THEN l.id ELSE NULL END) AS sc_bet_count,

            ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND l.currency_id != ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS sc_casino_wins,

            COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND l.currency_id != ${CURRENCY.GC} THEN l.id ELSE NULL END) AS sc_casino_wins_count,

            ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS gc_casino_wins,

            COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' AND l.currency_id = ${CURRENCY.GC} THEN l.id ELSE NULL END) AS gc_casino_wins_count,

            ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS gc_casino_bet_rollback,

            COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND l.currency_id = ${CURRENCY.GC} THEN l.id ELSE NULL END) AS gc_casino_bet_rollback_count,

            ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND l.currency_id != ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS sc_casino_bet_rollback,

            COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' AND l.currency_id != ${CURRENCY.GC} THEN l.id ELSE NULL END) AS sc_casino_bet_rollback_count,

            ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS gc_casino_win_rollback,

            COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND l.currency_id = ${CURRENCY.GC} THEN l.id ELSE NULL END) AS gc_casino_win_rollback_count,

            ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND l.currency_id != ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS sc_casino_win_rollback,

            COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' AND l.currency_id != ${CURRENCY.GC} THEN l.id ELSE NULL END) AS sc_casino_win_rollback_count,

            ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_COIN}' AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS gc_purchases,

            COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.PURCHASE_GC_COIN}' AND l.currency_id = ${CURRENCY.GC} THEN l.id ELSE NULL END) AS gc_purchases_count,

            ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_COIN}' AND l.currency_id = ${CURRENCY.PSC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS sc_purchases,

            COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_COIN}' AND l.currency_id = ${CURRENCY.PSC} THEN l.id ELSE NULL END) AS sc_purchases_count,

            ROUND(CAST(SUM(CASE WHEN l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_SC}') AND l.currency_id = ${CURRENCY.BSC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS sc_rewards,

            COUNT(CASE WHEN l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_SC}') AND l.currency_id = ${CURRENCY.BSC} THEN l.id ELSE NULL END) AS sc_rewards_count,

            ROUND(CAST(SUM(CASE WHEN l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_GC}') AND l.currency_id = ${CURRENCY.GC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS gc_rewards,

            COUNT(CASE WHEN l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_GC}') AND l.currency_id = ${CURRENCY.GC} THEN l.id ELSE NULL END) AS gc_rewards_count,

            ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.REDEEM_REJECTED}' AND l.transaction_type = '${LEDGER_TRANSACTION_TYPE.REDEEM}' AND l.currency_id = ${CURRENCY.RSC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS redeem_rejected_amount,

            COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.REDEEM_REJECTED}' AND l.transaction_type = '${LEDGER_TRANSACTION_TYPE.REDEEM}' AND l.currency_id = ${CURRENCY.RSC} THEN l.id ELSE NULL END) AS redeem_rejected_count,

            ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.REDEEM_FAILED}' AND l.transaction_type = '${LEDGER_TRANSACTION_TYPE.REDEEM}' AND l.currency_id = ${CURRENCY.RSC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS redeem_failed_amount,

            COUNT(CASE WHEN l.purpose = '${LEDGER_PURPOSE.REDEEM_FAILED}' AND l.transaction_type = '${LEDGER_TRANSACTION_TYPE.REDEEM}' AND l.currency_id = ${CURRENCY.RSC} THEN l.id ELSE NULL END) AS redeem_failed_count,

            ( SELECT COALESCE(SUM(l_sub.amount), 0)
              FROM ledgers l_sub
              WHERE l_sub.purpose = '${LEDGER_PURPOSE.REDEEM}'
              AND l_sub.currency_id = ${CURRENCY.RSC}
              AND EXISTS (
                SELECT 1 FROM withdrawals w_sub
                WHERE w_sub.transaction_id :: BIGINT = l_sub.transaction_id
                AND w_sub.status = '${WITHDRAWAL_STATUS.APPROVED}'
                AND w_sub.user_id = u.id
              )
            ) AS redeem_completed_amount,

            ( SELECT COUNT(*)
              FROM ledgers l_sub
              WHERE l_sub.purpose = '${LEDGER_PURPOSE.REDEEM}'
              AND l_sub.currency_id = ${CURRENCY.RSC}
              AND EXISTS (
                SELECT 1
                FROM withdrawals w_sub
                WHERE w_sub.transaction_id :: BIGINT = l_sub.transaction_id
                AND w_sub.status = '${WITHDRAWAL_STATUS.APPROVED}'
                AND w_sub.user_id = u.id
              )
            ) AS redeem_completed_count,

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
            AS NUMERIC), 2) AS net_profit

          FROM ledgers AS l
          LEFT JOIN wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
          LEFT JOIN users AS u ON w.user_id = u.id
          WHERE l.created_at >= (SELECT from_date FROM time_intervals)
          AND l.created_at < (SELECT till_date FROM time_intervals)

          GROUP BY u.id, is_internal
        )
        INSERT INTO player_report_aggregates (
          user_id, from_date, till_date, is_internal,gc_staked_amount, gc_bet_count, sc_staked_amount, sc_bet_count, sc_casino_wins, sc_casino_wins_count, gc_casino_wins, gc_casino_wins_count, gc_casino_bet_rollback, gc_casino_bet_rollback_count,sc_casino_bet_rollback, sc_casino_bet_rollback_count, gc_casino_win_rollback, gc_casino_win_rollback_count, sc_casino_win_rollback, sc_casino_win_rollback_count, gc_purchases, gc_purchases_count, sc_purchases, sc_purchases_count, sc_rewards, sc_rewards_count, gc_rewards, gc_rewards_count, redeem_rejected_amount, redeem_rejected_count, redeem_failed_amount, redeem_failed_count, redeem_completed_amount, redeem_completed_count, net_profit, created_at, updated_at
        )
        SELECT
          COALESCE(ps.user_id, null),
          ti.from_date,
          ti.till_date,
          COALESCE(ps.is_internal, null),
          COALESCE(ps.gc_staked_amount, 0),
          COALESCE(ps.gc_bet_count, 0),
          COALESCE(ps.sc_staked_amount, 0),
          COALESCE(ps.sc_bet_count, 0),
          COALESCE(ps.sc_casino_wins, 0),
          COALESCE(ps.sc_casino_wins_count, 0),
          COALESCE(ps.gc_casino_wins, 0),
          COALESCE(ps.gc_casino_wins_count, 0),
          COALESCE(ps.gc_casino_bet_rollback, 0),
          COALESCE(ps.gc_casino_bet_rollback_count, 0),
          COALESCE(ps.sc_casino_bet_rollback, 0),
          COALESCE(ps.sc_casino_bet_rollback_count, 0),
          COALESCE(ps.gc_casino_win_rollback, 0),
          COALESCE(ps.gc_casino_win_rollback_count, 0),
          COALESCE(ps.sc_casino_win_rollback, 0),
          COALESCE(ps.sc_casino_win_rollback_count, 0),
          COALESCE(ps.gc_purchases, 0),
          COALESCE(ps.gc_purchases_count, 0),
          COALESCE(ps.sc_purchases, 0),
          COALESCE(ps.sc_purchases_count, 0),
          COALESCE(ps.sc_rewards, 0),
          COALESCE(ps.sc_rewards_count, 0),
          COALESCE(ps.gc_rewards, 0),
          COALESCE(ps.gc_rewards_count, 0),
          COALESCE(ps.redeem_rejected_amount, 0),
          COALESCE(ps.redeem_rejected_count, 0),
          COALESCE(ps.redeem_failed_amount, 0),
          COALESCE(ps.redeem_failed_count, 0),
          COALESCE(ps.redeem_completed_amount, 0),
          COALESCE(ps.redeem_completed_count, 0),
          COALESCE(ps.net_profit, 0),
          NOW(),
          NOW()
        FROM time_intervals ti
        LEFT JOIN playerStatistics ps ON TRUE
        WHERE ps.user_id IS NOT NULL OR NOT EXISTS (SELECT 1 FROM playerStatistics)
        ON CONFLICT (user_id, from_date, till_date, is_internal) DO NOTHING;
      `
      await sequelize.query(query)

      return { success: true }
    } catch (error) {
      return { success: false, message: 'Error in cumulative player report Service', data: null, error }
    }
  }
}
