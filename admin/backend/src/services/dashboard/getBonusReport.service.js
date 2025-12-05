import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { LEDGER_PURPOSE, CURRENCY } from '@src/utils/constants/public.constants.utils'

const TAB_OPTIONS = {
  GAME: 'game',
  PROVIDER: 'provider'
}

const constraints = ajv.compile({
  type: 'object',
  properties: {
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    tab: { enum: Object.values(TAB_OPTIONS), default: TAB_OPTIONS.GAME },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    type: { enum: ['dashboard', 'report'], default: 'dashboard' },
    csvDownload: { type: ['string', 'null'] },
    tagIds: { type: 'string' }
  },
  required: []
})

export class GetBonusReportService extends ServiceBase {
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

      const query = `WITH filtered_aggregates AS (
        SELECT
          COALESCE(ROUND(SUM(vip_tier_monthly_bonus_count)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "vipTierMonthlyBonusCount",
          COALESCE(ROUND(SUM(vip_tier_monthly_bonus_gc_rewards)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "vipTierMonthlyBonusGCRewards",
          COALESCE(ROUND(SUM(vip_tier_monthly_bonus_sc_rewards)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "vipTierMonthlyBonusSCRewards",

          COALESCE(ROUND(SUM(vip_tier_weekly_bonus_count)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "vipTierWeeklyBonusCount",
          COALESCE(ROUND(SUM(vip_tier_weekly_bonus_gc_rewards)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "vipTierWeeklyBonusGCRewards",
          COALESCE(ROUND(SUM(vip_tier_weekly_bonus_sc_rewards)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "vipTierWeeklyBonusSCRewards",

          COALESCE(ROUND(SUM(purchase_bonus_count)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "purchaseBonusCount",
          COALESCE(ROUND(SUM(purchase_bonus_sc_rewards)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "purchaseBonusSCRewards",

          COALESCE(ROUND(SUM(spin_wheel_bonus_count)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "spinWheelBonusCount",
          COALESCE(ROUND(SUM(spin_wheel_bonus_gc_rewards)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "spinWheelBonusGCRewards",
          COALESCE(ROUND(SUM(spin_wheel_bonus_sc_rewards)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "spinWheelBonusSCRewards",

          COALESCE(ROUND(SUM(joining_bonus_count)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "joiningBonusCount",
          COALESCE(ROUND(SUM(joining_bonus_gc_rewards)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "joiningBonusGCRewards",
          COALESCE(ROUND(SUM(joining_bonus_sc_rewards)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "joiningBonusSCRewards",

          COALESCE(ROUND(SUM(daily_bonus_count)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "dailyBonusCount",
          COALESCE(ROUND(SUM(daily_bonus_gc_rewards)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "dailyBonusGCRewards",
          COALESCE(ROUND(SUM(daily_bonus_sc_rewards)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "dailyBonusSCRewards"

        FROM bonus_report
        WHERE (from_date, to_date) OVERLAPS(TIMESTAMP '${fromDate}', TIMESTAMP '${toDate}')
        AND is_internal = ${isInternal}
      ),
      filtered_transactions AS (
        SELECT
         COALESCE(COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}' AND l.currency_id = ${CURRENCY.BSC}), 0) AS "vipTierMonthlyBonusCount",

          COALESCE(ROUND(CAST(SUM(l.amount) FILTER (
            WHERE l.purpose = '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}' AND l.currency_id = ${CURRENCY.GC}
          ) AS NUMERIC), 2), 0) AS "vipTierMonthlyBonusGCRewards",

          COALESCE(ROUND(CAST(SUM(l.amount) FILTER (
            WHERE l.purpose = '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}' AND l.currency_id = ${CURRENCY.BSC}
          ) AS NUMERIC), 2), 0) AS "vipTierMonthlyBonusSCRewards",

          COALESCE(COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}' AND l.currency_id = ${CURRENCY.BSC}), 0) AS "vipTierWeeklyBonusCount",

          COALESCE(ROUND(CAST(SUM(l.amount) FILTER (
            WHERE l.purpose = '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}' AND l.currency_id = ${CURRENCY.GC}
          ) AS NUMERIC), 2), 0) AS "vipTierWeeklyBonusGCRewards",

          COALESCE(ROUND(CAST(SUM(l.amount) FILTER (
            WHERE l.purpose = '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}' AND l.currency_id = ${CURRENCY.BSC}
          ) AS NUMERIC), 2), 0) AS "vipTierWeeklyBonusSCRewards",

          COALESCE(COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}' AND l.currency_id = ${CURRENCY.BSC}), 0) AS "purchaseBonusCount",

          COALESCE(ROUND(CAST(SUM(l.amount) FILTER (
            WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE_SC_BONUS}' AND l.currency_id = ${CURRENCY.BSC}
          ) AS NUMERIC), 2), 0) AS "purchaseBonusSCRewards",

          COALESCE(COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.SPIN_WHEEL_SC}' AND l.currency_id = ${CURRENCY.BSC}), 0) AS "spinWheelBonusCount",

          COALESCE(ROUND(CAST(SUM(l.amount) FILTER (
            WHERE l.purpose = '${LEDGER_PURPOSE.SPIN_WHEEL_GC}' AND l.currency_id = ${CURRENCY.GC}
          ) AS NUMERIC), 2), 0) AS "spinWheelBonusGCRewards",

          COALESCE(ROUND(CAST(SUM(l.amount) FILTER (
            WHERE l.purpose = '${LEDGER_PURPOSE.SPIN_WHEEL_SC}' AND l.currency_id = ${CURRENCY.BSC}
          ) AS NUMERIC), 2), 0) AS "spinWheelBonusSCRewards",

          COALESCE(COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.JOINING_BONUS}' AND l.currency_id = ${CURRENCY.BSC}), 0) AS "joiningBonusCount",

          COALESCE(ROUND(CAST(SUM(l.amount) FILTER (
            WHERE l.purpose = '${LEDGER_PURPOSE.JOINING_BONUS}' AND l.currency_id = ${CURRENCY.GC}
          ) AS NUMERIC), 2), 0) AS "joiningBonusGCRewards",

          COALESCE(ROUND(CAST(SUM(l.amount) FILTER (
            WHERE l.purpose = '${LEDGER_PURPOSE.JOINING_BONUS}' AND l.currency_id = ${CURRENCY.BSC}
          ) AS NUMERIC), 2), 0) AS "joiningBonusSCRewards",

          COALESCE(COUNT(*) FILTER (WHERE l.purpose = '${LEDGER_PURPOSE.DAILY_BONUS}' AND l.currency_id = ${CURRENCY.BSC}), 0) AS "dailyBonusCount",

          COALESCE(ROUND(CAST(SUM(l.amount) FILTER (
            WHERE l.purpose = '${LEDGER_PURPOSE.DAILY_BONUS}' AND l.currency_id = ${CURRENCY.GC}
          ) AS NUMERIC), 2), 0) AS "dailyBonusGCRewards",

          COALESCE(ROUND(CAST(SUM(l.amount) FILTER (
            WHERE l.purpose = '${LEDGER_PURPOSE.DAILY_BONUS}' AND l.currency_id = ${CURRENCY.BSC}
          ) AS NUMERIC), 2), 0) AS "dailyBonusSCRewards"

          FROM ledgers AS l
          JOIN wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
          WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS}', '${LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS}', '${LEDGER_PURPOSE.DAILY_BONUS}', '${LEDGER_PURPOSE.JOINING_BONUS}', '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}', '${LEDGER_PURPOSE.BONUS_CASHED}', '${LEDGER_PURPOSE.BONUS_DEPOSIT}', '${LEDGER_PURPOSE.ADD_COIN}', '${LEDGER_PURPOSE.SPIN_WHEEL_SC}')

          AND l.created_at <= '${toDate}'::TIMESTAMP
          AND l.created_at >= (SELECT COALESCE(MAX(to_date), '${fromDate}') FROM bonus_report)

          ${isInternal
          ? `AND EXISTS (
          SELECT 1
            FROM public.user_tags ut
            INNER JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = w.user_id
            AND tg.tag = 'INTERNAL'
            AND ut.updated_at <= w.created_at
        )`
          : `AND NOT EXISTS (
          SELECT 1
            FROM public.user_tags ut
            INNER JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = w.user_id
            AND tg.tag = 'INTERNAL'
            AND ut.updated_at <= w.created_at
        )`}
      )
      SELECT
      fa."vipTierMonthlyBonusCount" + ft."vipTierMonthlyBonusCount" AS "vipTierMonthlyBonusCount",
      fa."vipTierMonthlyBonusGCRewards" + ft."vipTierMonthlyBonusGCRewards" AS "vipTierMonthlyBonusGCRewards",
      fa."vipTierMonthlyBonusSCRewards" + ft."vipTierMonthlyBonusSCRewards" AS "vipTierMonthlyBonusSCRewards",

      fa."vipTierWeeklyBonusCount" + ft."vipTierWeeklyBonusCount" AS "vipTierWeeklyBonusCount",
      fa."vipTierWeeklyBonusGCRewards" + ft."vipTierWeeklyBonusGCRewards" AS "vipTierWeeklyBonusGCRewards",
      fa."vipTierWeeklyBonusSCRewards" + ft."vipTierWeeklyBonusSCRewards" AS "vipTierWeeklyBonusSCRewards",

      fa."purchaseBonusCount" + ft."purchaseBonusCount" AS "purchaseBonusCount",
      fa."purchaseBonusSCRewards" + ft."purchaseBonusSCRewards" AS "purchaseBonusSCRewards",

      fa."spinWheelBonusCount" + ft."spinWheelBonusCount" AS "spinWheelBonusCount",
      fa."spinWheelBonusGCRewards" + ft."spinWheelBonusGCRewards" AS "spinWheelBonusGCRewards",
      fa."spinWheelBonusSCRewards" + ft."spinWheelBonusSCRewards" AS "spinWheelBonusSCRewards",

      fa."joiningBonusCount" + ft."joiningBonusCount" AS "joiningBonusCount",
      fa."joiningBonusGCRewards" + ft."joiningBonusGCRewards" AS "joiningBonusGCRewards",
      fa."joiningBonusSCRewards" + ft."joiningBonusSCRewards" AS "joiningBonusSCRewards",

      fa."dailyBonusCount" + ft."dailyBonusCount" AS "dailyBonusCount",
      fa."dailyBonusGCRewards" + ft."dailyBonusGCRewards" AS "dailyBonusGCRewards",
      fa."dailyBonusSCRewards" + ft."dailyBonusSCRewards" AS "dailyBonusSCRewards"

      FROM filtered_aggregates fa, filtered_transactions ft;
      `

      const result = await this.context.sequelize.query(query, { type: this.context.sequelize.QueryTypes.SELECT, logging: false })
      const updatedResult = [
        {
          type: 'vipTierMonthlyBonus',
          count: result?.[0]?.vipTierMonthlyBonusCount || 0,
          sc: result?.[0]?.vipTierMonthlyBonusSCRewards || 0,
          gc: result?.[0]?.vipTierMonthlyBonusGCRewards || 0
        },
        {
          type: 'vipTierWeeklyBonus',
          count: result?.[0]?.vipTierWeeklyBonusCount || 0,
          sc: result?.[0]?.vipTierWeeklyBonusSCRewards || 0,
          gc: result?.[0]?.vipTierWeeklyBonusGCRewards || 0
        },
        {
          type: 'purchaseBonus',
          count: result?.[0]?.purchaseBonusCount || 0,
          sc: result?.[0]?.purchaseBonusSCRewards || 0,
          gc: 0
        },
        {
          type: 'spinWheelBonus',
          count: result?.[0]?.spinWheelBonusCount || 0,
          sc: result?.[0]?.spinWheelBonusSCRewards || 0,
          gc: result?.[0]?.spinWheelBonusGCRewards || 0
        },
        {
          type: 'joiningBonus',
          count: result?.[0]?.joiningBonusCount || 0,
          sc: result?.[0]?.joiningBonusSCRewards || 0,
          gc: result?.[0]?.joiningBonusGCRewards || 0
        },
        {
          type: 'dailyBonus',
          count: result?.[0]?.dailyBonusCount || 0,
          sc: result?.[0]?.dailyBonusSCRewards || 0,
          gc: result?.[0]?.dailyBonusGCRewards || 0
        }
      ]

      return { result: updatedResult }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
