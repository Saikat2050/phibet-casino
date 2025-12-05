import { sequelize } from '@src/database'
import { Logger } from '@src/libs/logger'
import { ServiceBase } from '@src/libs/serviceBase'
import { LEDGER_PURPOSE, CURRENCY } from '@src/utils/constants/public.constants.utils'

export class CumulativeBonusReportService extends ServiceBase {
  async run () {
    try {
      const query = `WITH time_intervals AS (
        SELECT
        DATE_TRUNC('minute', NOW()) - INTERVAL '15 minutes' AS from_date,
        DATE_TRUNC('minute', NOW()) AS to_date
      ),
      plyers_data AS (
        SELECT
        (EXISTS (
          SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          AND tg.tag = 'INTERNAL'
          AND ut.updated_at <= usr.created_at
        )) AS is_internal,
        COUNT(*) AS "playerRegisterCount"
        FROM users AS usr
        WHERE usr.created_at >= (SELECT from_date FROM time_intervals)
        AND usr.created_at < (SELECT to_date FROM time_intervals)
        GROUP BY is_internal
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

        COUNT(*) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_GC}') AND l.currency_id = ${CURRENCY.GC}) AS "gcRewardsCount",

        COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}' AND l.currency_id = ${CURRENCY.BSC}) AS "vipTierMonthlyBonusCount",

        ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}') AND l.currency_id = ${CURRENCY.GC} ) AS NUMERIC), 2)
        AS "vipTierMonthlyBonusGCRewards",

        ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}') AND l.currency_id = ${CURRENCY.BSC} ) AS NUMERIC), 2)
        AS "vipTierMonthlyBonusSCRewards",

        COUNT(*) FILTER (WHERE l.purpose IN ( '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}') AND l.currency_id = ${CURRENCY.BSC}) AS "vipTierWeeklyBonusCount",

        ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}') AND l.currency_id = ${CURRENCY.GC} ) AS NUMERIC), 2)
        AS "vipTierWeeklyBonusGCRewards",

        ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}') AND l.currency_id = ${CURRENCY.BSC} ) AS NUMERIC), 2)
        AS "vipTierWeeklyBonusSCRewards",

        COUNT(*) FILTER (WHERE l.purpose IN ( '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}') AND l.currency_id = ${CURRENCY.BSC}) AS "purchaseBonusCount",

        ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}') AND l.currency_id = ${CURRENCY.BSC} ) AS NUMERIC), 2)
        AS "purchaseBonusSCRewards",

        COUNT(*) FILTER (WHERE l.purpose IN ( '${LEDGER_PURPOSE.SPIN_WHEEL_SC}') AND l.currency_id = ${CURRENCY.BSC}) AS "spinWheelBonusCount",

        ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.SPIN_WHEEL_GC}') AND l.currency_id = ${CURRENCY.GC} ) AS NUMERIC), 2)
        AS "spinWheelBonusGCRewards",

        ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.SPIN_WHEEL_SC}') AND l.currency_id = ${CURRENCY.BSC} ) AS NUMERIC), 2)
        AS "spinWheelBonusSCRewards",

        COUNT(*) FILTER (WHERE l.purpose IN ( '${LEDGER_PURPOSE.JOINING_BONUS}') AND l.currency_id = ${CURRENCY.BSC}) AS "joiningBonusCount",

        ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.JOINING_BONUS}') AND l.currency_id = ${CURRENCY.GC} ) AS NUMERIC), 2)
        AS "joiningBonusGCRewards",

        ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.JOINING_BONUS}') AND l.currency_id = ${CURRENCY.BSC} ) AS NUMERIC), 2)
        AS "joiningBonusSCRewards",

        COUNT(*) FILTER (WHERE l.purpose IN ( '${LEDGER_PURPOSE.DAILY_BONUS}') AND l.currency_id = ${CURRENCY.BSC}) AS "dailyBonusCount",

        ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.DAILY_BONUS}') AND l.currency_id = ${CURRENCY.GC} ) AS NUMERIC), 2)
        AS "dailyBonusGCRewards",

        ROUND(CAST(SUM(l.amount) FILTER (WHERE l.purpose IN ('${LEDGER_PURPOSE.DAILY_BONUS}') AND l.currency_id = ${CURRENCY.BSC} ) AS NUMERIC), 2)
        AS "dailyBonusSCRewards"

        FROM ledgers AS l
        JOIN wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
        WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_SC}')

        AND l.created_at >= (SELECT from_date FROM time_intervals)
        AND l.created_at < (SELECT to_date FROM time_intervals)
        GROUP BY is_internal
      ),

      distinct_is_internal AS (
        SELECT is_internal FROM bonus_data WHERE is_internal IS NOT NULL
      )
      INSERT INTO bonus_report (
          from_date,
          to_date,
          is_internal,
          vip_tier_monthly_bonus_count,
          vip_tier_monthly_bonus_gc_rewards,
          vip_tier_monthly_bonus_sc_rewards,
          vip_tier_weekly_bonus_count,
          vip_tier_weekly_bonus_gc_rewards,
          vip_tier_weekly_bonus_sc_rewards,
          purchase_bonus_count,
          purchase_bonus_sc_rewards,
          spin_wheel_bonus_count,
          spin_wheel_bonus_gc_rewards,
          spin_wheel_bonus_sc_rewards,
          joining_bonus_count,
          joining_bonus_gc_rewards,
          joining_bonus_sc_rewards,
          daily_bonus_count,
          daily_bonus_gc_rewards,
          daily_bonus_sc_rewards,
          player_register_count,
          created_at,
          updated_at
      )
      SELECT
      ti.from_date,
      ti.to_date,
      di.is_internal,
      COALESCE(bd."vipTierMonthlyBonusCount", 0),
      COALESCE(bd."vipTierMonthlyBonusGCRewards", 0),
      COALESCE(bd."vipTierMonthlyBonusSCRewards", 0),
      COALESCE(bd."vipTierWeeklyBonusCount", 0),
      COALESCE(bd."vipTierWeeklyBonusGCRewards", 0),
      COALESCE(bd."vipTierWeeklyBonusSCRewards", 0),
      COALESCE(bd."purchaseBonusCount", 0),
      COALESCE(bd."purchaseBonusSCRewards", 0),
      COALESCE(bd."spinWheelBonusCount", 0),
      COALESCE(bd."spinWheelBonusGCRewards", 0),
      COALESCE(bd."spinWheelBonusSCRewards", 0),
      COALESCE(bd."joiningBonusCount", 0),
      COALESCE(bd."joiningBonusGCRewards", 0),
      COALESCE(bd."joiningBonusSCRewards", 0),
      COALESCE(bd."dailyBonusCount", 0),
      COALESCE(bd."dailyBonusGCRewards", 0),
      COALESCE(bd."dailyBonusSCRewards", 0),
      COALESCE(pd."playerRegisterCount", 0),
      NOW() AS created_at,
      NOW() AS updated_at
      FROM time_intervals ti
      LEFT JOIN distinct_is_internal di ON 1=1
      LEFT JOIN plyers_data pd ON pd.is_internal = di.is_internal
      LEFT JOIN bonus_data bd ON bd.is_internal = di.is_internal
      ON CONFLICT (from_date, to_date, is_internal) DO NOTHING;
    `
      await sequelize.query(query)
      return { success: true }
    } catch (error) {
      Logger.error('Bonus Report Service', { message: 'Error in Bonus report Service', exception: error })
      return { success: false, message: 'Error in Bonus report Service', data: null, error }
    }
  }
}
