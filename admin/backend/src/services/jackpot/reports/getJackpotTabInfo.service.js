import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import { sequelize } from '@src/database/models'

export class GetJackpotTabsInfoService extends ServiceBase {
  async run () {
    try {
      const [data] = await sequelize.query(`
      WITH first_jackpot_start_date AS (
        SELECT start_date
        FROM jackpots
        WHERE deleted_at IS NULL
        ORDER BY start_date ASC
        LIMIT 1
      )
      SELECT
        ROUND(SUM(COALESCE(jackpot_pool_earning, 0))::numeric, 2) AS "masterWalletCreditSum",
        ROUND(SUM(COALESCE(seed_amount, 0))::numeric, 2) AS "seedAmountSum",
        ROUND(SUM(COALESCE(jackpot_pool_earning, 0))::numeric, 2) - ROUND(SUM(COALESCE(seed_amount, 0))::numeric, 2) AS "netRevenue", 
        CASE WHEN (SELECT start_date FROM first_jackpot_start_date) IS NOT NULL THEN ROUND(ROUND(SUM(COALESCE(jackpot_pool_earning, 0))::numeric, 2) / FLOOR(EXTRACT(EPOCH FROM (NOW() - (SELECT start_date FROM first_jackpot_start_date))) / 3600 )::numeric, 2) ELSE 0 END AS "hourlyEarningRate",
        ROUND(MAX(COALESCE(jackpot_pool_earning, 0) - COALESCE(seed_amount, 0))::numeric, 2) AS "maxRevenue",
        ROUND(SUM(COALESCE(ticket_sold, 0))::numeric, 0) AS "totalSpinCounts"
      FROM jackpots
        WHERE status IN (1,2);
    `, {
        type: sequelize.QueryTypes.SELECT
      })

      return {
        success: true,
        data
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
