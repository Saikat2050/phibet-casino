import { sequelize } from '@src/database'
import { ServiceBase } from '@src/libs/serviceBase'
import { LEDGER_TRANSACTION_TYPE } from '@src/utils/constants/payment.constants'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'

export class CumulativeGameReportService extends ServiceBase {
  async run () {
    try {
      const query = `
        WITH time_intervals AS (
        SELECT
          DATE_TRUNC('minute', NOW()) - INTERVAL '15 minutes' AS from_date,
          DATE_TRUNC('minute', NOW()) AS till_date
        ),
        game_transactions AS (
          SELECT
            casinoGame.id AS game_id,
            casinoGame.casino_provider_id AS provider_id,
            ledger.currency_id AS currency_id,
            (EXISTS (
              SELECT 1
              FROM public.user_tags ut
              INNER JOIN public.tags tg ON ut.tag_id = tg.id
              WHERE ut.user_id = casinoTransaction.user_id
              AND tg.tag = 'INTERNAL'
              AND ut.updated_at <= casinoTransaction.created_at
            )) AS is_internal,

            ROUND(CAST(SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_BET}' THEN ledger.amount ELSE 0 END) AS NUMERIC), 2) AS total_bet_amount,
            COUNT(*) FILTER (WHERE ledger.purpose = '${LEDGER_PURPOSE.CASINO_BET}') AS total_bet_count,

            ROUND(CAST(SUM(CASE WHEN ledger.purpose =  '${LEDGER_PURPOSE.CASINO_WIN}' THEN ledger.amount ELSE 0 END) AS NUMERIC), 2) AS total_win_amount,
            COUNT(*) FILTER (WHERE ledger.purpose  = '${LEDGER_PURPOSE.CASINO_WIN}') AS total_win_count,

            ROUND(CAST(SUM(CASE WHEN ledger.purpose =  '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' THEN ledger.amount ELSE 0 END) AS NUMERIC), 2) AS total_bet_rollback_amount,
            COUNT(*) FILTER (WHERE ledger.purpose  = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}') AS total_bet_rollback_count,

            ROUND(CAST(SUM(CASE WHEN ledger.purpose =  '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}'THEN ledger.amount ELSE 0 END) AS NUMERIC), 2) AS total_win_rollback_amount,
            COUNT(*) FILTER (WHERE ledger.purpose  = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}') AS total_win_rollback_count

          FROM public.casino_transactions AS casinoTransaction
            INNER JOIN public.ledgers AS ledger
              ON casinoTransaction.id = ledger.transaction_id
              AND ledger.transaction_type = '${LEDGER_TRANSACTION_TYPE.CASINO}'
            INNER JOIN public.casino_games AS casinoGame
              ON casinoTransaction.game_id = casinoGame.id
          WHERE casinoTransaction.created_at >= (SELECT from_date FROM time_intervals)
            AND casinoTransaction.created_at < (SELECT till_date FROM time_intervals)
            AND ledger.purpose IN ('${LEDGER_PURPOSE.CASINO_BET}', '${LEDGER_PURPOSE.CASINO_WIN}', '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}', '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}')
          GROUP BY casinoGame.id, casinoGame.casino_provider_id, ledger.currency_id, is_internal
        )
        INSERT INTO game_report_aggregates (
          from_date, till_date, game_id, provider_id, currency_id, is_internal, total_bet_amount, total_bet_count, total_win_amount, total_win_count, total_bet_rollback_amount, total_bet_rollback_count, total_win_rollback_amount, total_win_rollback_count, created_at, updated_at
        )
        SELECT
          ti.from_date,
          ti.till_date,
          COALESCE(gt.game_id, NULL) AS game_id,
          COALESCE(gt.provider_id, NULL) AS provider_id,
          COALESCE(gt.currency_id, NULL) AS currency_id,
          COALESCE(gt.is_internal, NULL) AS is_internal,
          COALESCE(gt.total_bet_amount, 0) AS total_bet_amount,
          COALESCE(gt.total_bet_count, 0) AS total_bet_count,
          COALESCE(gt.total_win_amount, 0) AS total_win_amount,
          COALESCE(gt.total_win_count, 0) AS total_win_count,
          COALESCE(gt.total_bet_rollback_amount, 0) AS total_bet_rollback_amount,
          COALESCE(gt.total_bet_rollback_count, 0) AS total_bet_rollback_count,
          COALESCE(gt.total_win_rollback_amount, 0) AS total_win_rollback_amount,
          COALESCE(gt.total_win_rollback_count, 0) AS total_win_rollback_count,
          NOW(),
          NOW()
          FROM time_intervals ti
          LEFT JOIN game_transactions gt ON TRUE
        ON CONFLICT (from_date, till_date, game_id, provider_id, currency_id, is_internal) DO NOTHING;
      `
      await sequelize.query(query)

      return { success: true }
    } catch (error) {
      return { success: false, message: 'Error in cumulative game report Service', data: null, error }
    }
  }
}
