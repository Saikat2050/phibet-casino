'use strict'

const { LEDGER_PURPOSE } = require('@src/utils/constants/public.constants.utils')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE MATERIALIZED VIEW daily_statistical_summary AS
      WITH daily_totals AS (
        SELECT
          DATE_TRUNC('day', l.created_at) AS date,
          u.id AS userId,
          u.username AS username,

          -- Counts and Amounts for GC Coin Values
          COUNT(DISTINCT l.transaction_id) FILTER (WHERE l.purpose IN (:depositPurposes)) AS gc_purchase_count,
          COUNT(DISTINCT l.transaction_id) FILTER (WHERE l.purpose = :withdrawPurpose) AS gc_redeem_count,
          SUM(CASE WHEN l.currency_id = 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose IN (:depositPurposes)) AS gc_total_purchase_amount,
          SUM(CASE WHEN l.currency_id = 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose = :withdrawPurpose) AS gc_total_redeem_amount,
          SUM(CASE WHEN l.currency_id = 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose = :casinoBetPurpose) AS gc_total_casino_bet_amount,
          COUNT(DISTINCT l.transaction_id) FILTER (WHERE l.purpose = :casinoBetPurpose AND l.currency_id = 1) AS gc_casino_bet_count,
          SUM(CASE WHEN l.currency_id = 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose IN (:casinoWinPurposes)) AS gc_total_casino_win_amount,
          COUNT(DISTINCT l.transaction_id) FILTER (WHERE l.purpose IN (:casinoWinPurposes) AND l.currency_id = 1) AS gc_casino_win_count,
          SUM(CASE WHEN l.currency_id = 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose IN (:tournamentBuyPurposes)) AS gc_total_tournament_buy,
          SUM(CASE WHEN l.currency_id = 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose IN (:tournamentWinPurposes)) AS gc_total_tournament_win,

          -- Counts and Amounts for SC Coin Values
          COUNT(DISTINCT l.transaction_id) FILTER (WHERE l.purpose IN (:depositPurposes) AND l.currency_id != 1) AS sc_purchase_count,
          COUNT(DISTINCT l.transaction_id) FILTER (WHERE l.purpose = :withdrawPurpose AND l.currency_id != 1) AS sc_redeem_count,
          SUM(CASE WHEN l.currency_id != 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose IN (:depositPurposes)) AS sc_total_purchase_amount,
          SUM(CASE WHEN l.currency_id != 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose = :withdrawPurpose) AS sc_total_redeem_amount,
          SUM(CASE WHEN l.currency_id = 2 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose = :depositPurposes) AS sc_rewarded_amount,
          SUM(CASE WHEN l.currency_id != 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose = :casinoBetPurpose) AS sc_total_casino_bet_amount,
          COUNT(DISTINCT l.transaction_id) FILTER (WHERE l.purpose = :casinoBetPurpose AND l.currency_id != 1) AS sc_casino_bet_count,
          SUM(CASE WHEN l.currency_id != 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose IN (:casinoWinPurposes)) AS sc_total_casino_win_amount,
          COUNT(DISTINCT l.transaction_id) FILTER (WHERE l.purpose IN (:casinoWinPurposes) AND l.currency_id != 1) AS sc_casino_win_count,
          SUM(CASE WHEN l.currency_id != 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose IN (:tournamentBuyPurposes)) AS sc_total_tournament_buy,
          SUM(CASE WHEN l.currency_id != 1 THEN l.amount ELSE 0 END) FILTER (WHERE l.purpose IN (:tournamentWinPurposes)) AS sc_total_tournament_win

        FROM
          "public"."ledgers" AS l
        JOIN
          wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
        JOIN
          users AS u ON w.user_id = u.id
        WHERE
          l.purpose IN (:allPurposes)
        GROUP BY
          DATE_TRUNC('day', l.created_at), u.id, u.username
      )
      SELECT
        date,
        COUNT(DISTINCT userId) AS active_users_count,
        SUM(gc_purchase_count) AS gc_purchase_count,
        SUM(gc_redeem_count) AS gc_redeem_count,
        ROUND(SUM(gc_total_purchase_amount)::numeric, 2) AS gc_total_purchase_amount,
        ROUND(SUM(gc_total_redeem_amount)::numeric, 2) AS gc_total_redeem_amount,
        SUM(gc_casino_bet_count) AS gc_casino_bet_count,
        SUM(gc_casino_win_count) AS gc_casino_win_count,
        ROUND(SUM(gc_total_casino_bet_amount)::numeric, 2) AS gc_total_casino_bet_amount,
        ROUND(SUM(gc_total_casino_win_amount)::numeric, 2) AS gc_total_casino_win_amount,
        ROUND(SUM(gc_total_tournament_buy)::numeric, 2) AS gc_total_tournament_buy,
        ROUND(SUM(gc_total_tournament_win)::numeric, 2) AS gc_total_tournament_win,
        ROUND(SUM(sc_rewarded_amount)::numeric, 2) AS sc_rewarded_amount,
        SUM(sc_purchase_count) AS sc_purchase_count,
        SUM(sc_redeem_count) AS sc_redeem_count,
        ROUND(SUM(sc_total_purchase_amount)::numeric, 2) AS sc_total_purchase_amount,
        ROUND(SUM(sc_total_redeem_amount)::numeric, 2) AS sc_total_redeem_amount,
        SUM(sc_casino_bet_count) AS sc_casino_bet_count,
        SUM(sc_casino_win_count) AS sc_casino_win_count,
        ROUND(SUM(sc_total_casino_bet_amount)::numeric, 2) AS sc_total_casino_bet_amount,
        ROUND(SUM(sc_total_casino_win_amount)::numeric, 2) AS sc_total_casino_win_amount,
        ROUND(SUM(sc_total_tournament_buy)::numeric, 2) AS sc_total_tournament_buy,
        ROUND(SUM(sc_total_tournament_win)::numeric, 2) AS sc_total_tournament_win

      FROM
        daily_totals
      GROUP BY
        date
      ORDER BY
        date ASC
    `, {
      replacements: {
        depositPurposes: [LEDGER_PURPOSE.PURCHASE],
        withdrawPurpose: LEDGER_PURPOSE.REDEEM,
        casinoBetPurpose: LEDGER_PURPOSE.CASINO_BET,
        casinoWinPurposes: [LEDGER_PURPOSE.CASINO_WIN, LEDGER_PURPOSE.CASINO_REFUND],
        tournamentBuyPurposes: [LEDGER_PURPOSE.TOURNAMENT_ENROLL, LEDGER_PURPOSE.TOURNAMENT_REBUY],
        tournamentWinPurposes: [LEDGER_PURPOSE.TOURNAMENT_CANCEL, LEDGER_PURPOSE.TOURNAMENT_WIN],
        allPurposes: [
          LEDGER_PURPOSE.PURCHASE,
          LEDGER_PURPOSE.REDEEM,
          LEDGER_PURPOSE.CASINO_BET,
          LEDGER_PURPOSE.CASINO_WIN,
          LEDGER_PURPOSE.CASINO_REFUND,
          LEDGER_PURPOSE.TOURNAMENT_ENROLL,
          LEDGER_PURPOSE.TOURNAMENT_WIN,
          LEDGER_PURPOSE.TOURNAMENT_CANCEL,
          LEDGER_PURPOSE.TOURNAMENT_REBUY,
          LEDGER_PURPOSE.REFERRAL_DEPOSIT
        ]
      }
    })

    await queryInterface.sequelize.query('CREATE UNIQUE INDEX daily_statistical_summary_idx ON daily_statistical_summary (date)')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP MATERIALIZED VIEW IF EXISTS daily_statistical_summary')
  }
}
