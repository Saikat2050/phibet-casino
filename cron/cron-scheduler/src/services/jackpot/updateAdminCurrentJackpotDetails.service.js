import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import sequelize from 'sequelize'
import { emitAdminEndJackpotNotification } from '@src/socket-resources/emitters/jackpotNotification.emmitter'
import { pubSubRedisClient } from '@src/libs/pubSubRedisClient'
import { minus } from 'number-precision'
const client = pubSubRedisClient.client

export class UpdateAdminCurrentJackpotDetailService extends ServiceBase {
  async run () {
    try {
      let [cacheResponse, onlineJackpot] = await Promise.all([client.get('current-jackpot-cache'), client.get('jackpot-details')])

      if (!onlineJackpot) return { success: true, message: 'No Online Jackpot', data: {} }

      onlineJackpot = JSON.parse(onlineJackpot)

      cacheResponse ? cacheResponse = JSON.parse(cacheResponse) : cacheResponse = {}

      const [currentJackpotData] = await sequelize.query(`
      WITH jackpot_data AS (
        SELECT
          jackpot_id,
          start_date,
          end_date,
          COALESCE(jackpot_pool_amount, 0) AS jackpot_pool_amount,
          COALESCE(jackpot_pool_earning, 0) AS jackpot_pool_earning,
          COALESCE(seed_amount, 0) AS seed_amount,
          ticket_sold
        FROM jackpots
        WHERE jackpot_id = ${onlineJackpot.jackpotId}
      )
    SELECT
      ticket_sold AS "totalSpinCounts",
      ROUND(jackpot_pool_amount::numeric, 2) AS "currentJackpotPool",
      ROUND((jackpot_pool_earning - seed_amount)::numeric, 2) AS "currentJackpotRevenue"
    FROM jackpot_data;`, {
        type: sequelize.QueryTypes.SELECT,
        jackpotId: +onlineJackpot.jackpotId
      })

      currentJackpotData.totalSpinCountDiff = +minus(+currentJackpotData.totalSpinCounts, +cacheResponse?.totalSpinCounts || +currentJackpotData.totalSpinCounts)
      currentJackpotData.currentJackpotPoolDiff = +minus(+currentJackpotData.currentJackpotPool, +cacheResponse?.currentJackpotPool || +currentJackpotData.currentJackpotPool)
      currentJackpotData.currentJackpotRevenueDiff = +minus(+currentJackpotData.currentJackpotRevenue, +cacheResponse?.currentJackpotRevenue || +currentJackpotData.currentJackpotRevenue)

      await client.set('current-jackpot-cache', JSON.stringify(currentJackpotData))

      emitAdminEndJackpotNotification(currentJackpotData)
      return { success: true, message: 'Success', data: currentJackpotData }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
