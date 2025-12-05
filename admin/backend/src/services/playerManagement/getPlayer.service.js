import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { CURRENCY, LEDGER_PURPOSE, LEDGER_TRANSACTION_TYPE, WITHDRAWAL_STATUS } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    playerId: { type: 'string' }
  },
  required: ['playerId']
})

export class GetPlayerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const query = `WITH existing_data AS (
        SELECT
          ps.user_id AS "userId",
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
        AND ps.user_id = ${this.args.playerId}
        AND ps.user_id IS NOT NULL
        GROUP BY ps.user_id
      ),
      computed_missing_data AS (
        SELECT
          w.user_id AS "userId",
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
          ROUND(CAST(SUM(CASE WHEN l.purpose = '${LEDGER_PURPOSE.REDEEEM_FAILED}' AND l.transaction_type = '${LEDGER_TRANSACTION_TYPE.REDEEM}' AND l.currency_id = ${CURRENCY.RSC} THEN l.amount ELSE 0 END) AS NUMERIC), 2) AS "redeemFailedAmount",
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
        WHERE l.created_at >= COALESCE((SELECT MAX(till_date) FROM player_report_aggregates), u.created_at)
        AND w.user_id = ${this.args.playerId}
        GROUP BY w.user_id
      ),
      combined_data AS (
        SELECT * FROM existing_data
        UNION ALL
        SELECT * FROM computed_missing_data
      )
        SELECT
          "userId",
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
        GROUP BY "userId"
    `

      const [playerDetailResult, playerStatsResult] = await Promise.all([this.context.sequelize.models.user.findOne({
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        where: { id: this.args.playerId },
        include: [{
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.wallet,
          include: {
            model: this.context.sequelize.models.currency,
            attributes: ['code', 'isDefault']
          }
        }, {
          attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'lastLoggedInIp', 'loggedInAt', 'publicAddress'] },
          model: this.context.sequelize.models.user,
          as: 'referral'
        }, {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.userLimit
        }, {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.userComment
        }, {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.userTag,
          include: {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            model: this.context.sequelize.models.tag
          }
        }, {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.address
        }]
      }),
      this.context.sequelize.query(query, {
        type: this.context.sequelize.QueryTypes.SELECT
      })
      ])

      if (!playerDetailResult) return this.addError('UserDoesNotExistsErrorType')

      return { user: playerDetailResult, playerStats: playerStatsResult }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
