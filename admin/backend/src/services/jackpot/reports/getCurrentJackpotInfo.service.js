import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import { JACKPOT_STATUS } from '@src/utils/constants/app.constants'
import { round, times } from 'lodash'
import { minus, plus } from 'number-precision'
import { Op } from 'sequelize'
import { client } from '@src/libs/redis'
import { sequelize } from '@src/database/models'

export class GetCurrentJackpotInfoService extends ServiceBase {
  async run () {
    try {
      let [cacheResponse, onlineJackpot] = await Promise.all([
        client.get('current-jackpot-cache'),
        this.context.sequelize.models.jackpot.findOne({
          where: { status: JACKPOT_STATUS.RUNNING },
          order: [['createdAt', 'ASC']],
          raw: true
        })
      ])
      if (!onlineJackpot) {
        const nextJackpot = await this.context.sequelize.models.jackpot.findOne({
          where: { status: JACKPOT_STATUS.UPCOMING },
          order: [['createdAt', 'ASC']],
          raw: true
        })
        return {
          success: true,
          message: 'No Online Jackpot',
          data: {
            jackpotTabs: null,
            runningJackpot: null,
            nextJackpot
          }
        }
      }
      cacheResponse ? cacheResponse = JSON.parse(cacheResponse) : cacheResponse = {}
      const [[currentJackpotData], nextJackpot] = await Promise.all([sequelize.query(`
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
      }),
      this.context.sequelize.models.jackpot.findOne({
        where: {
          jackpotId: { [Op.gt]: +onlineJackpot.jackpotId }
        },
        order: [['createdAt', 'ASC']],
        raw: true
      })
      ])

      currentJackpotData.totalSpinCountDiff = +minus(+currentJackpotData.totalSpinCounts, +cacheResponse?.totalSpinCounts || +currentJackpotData.totalSpinCounts)
      currentJackpotData.currentJackpotPoolDiff = +minus(+currentJackpotData.currentJackpotPool, +cacheResponse?.currentJackpotPool || +currentJackpotData.currentJackpotPool)
      currentJackpotData.currentJackpotRevenueDiff = +minus(+currentJackpotData.currentJackpotRevenue, +cacheResponse?.currentJackpotRevenue || +currentJackpotData.currentJackpotRevenue)

      onlineJackpot.jackpotEstEarning = +round(+times(+round(+times(+onlineJackpot.adminShare, +onlineJackpot.entryAmount), 2), +onlineJackpot.winningTicket), 2)
      onlineJackpot.jackpotEstPool = +round(+plus(+times(+round(+times(+onlineJackpot.poolShare, +onlineJackpot.entryAmount), 2), +onlineJackpot.winningTicket), +onlineJackpot.seedAmount), 2)
      onlineJackpot.jackpotEstRevenue = +round(+minus(+round(+times(+round(+times(+onlineJackpot.adminShare, +onlineJackpot.entryAmount), 2), +onlineJackpot.winningTicket), 2), +onlineJackpot.seedAmount), 2)

      if (nextJackpot) {
        nextJackpot.jackpotEstEarning = +round(+times(+round(+times(+nextJackpot.adminShare, +nextJackpot.entryAmount), 2), +nextJackpot.winningTicket), 2)
        nextJackpot.jackpotEstPool = +round(+plus(+times(+round(+times(+nextJackpot.poolShare, +nextJackpot.entryAmount), 2), +nextJackpot.winningTicket), +nextJackpot.seedAmount), 2)
        nextJackpot.jackpotEstRevenue = +round(+minus(+round(+times(+round(+times(+nextJackpot.adminShare, +nextJackpot.entryAmount), 2), +nextJackpot.winningTicket), 2), +nextJackpot.seedAmount), 2)
      }

      return {
        success: true,
        data: {
          jackpotTabs: currentJackpotData,
          runningJackpot: onlineJackpot,
          nextJackpot
        }
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
