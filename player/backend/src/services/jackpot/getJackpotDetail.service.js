import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'
import { sequelize } from '@src/database/models'
import { Cache } from '@src/libs/cache'
import { round } from 'lodash'
export class GetJackpotDetailService extends ServiceBase {
  async run () {
    try {
      const jackpotPage = this.args.userId
      let currentJackpotDetails = await Cache.get('jackpot-details')

      if (currentJackpotDetails) {
        if (typeof currentJackpotDetails === 'string') {
          try {
            currentJackpotDetails = JSON.parse(currentJackpotDetails)
          } catch (err) {
            currentJackpotDetails = null
          }
        } else if (typeof currentJackpotDetails !== 'object') {
          currentJackpotDetails = null
        }
      }

      const recentJackpotDetails = jackpotPage !== 'false' && await sequelize.query(`
      SELECT
        USERS.USERNAME AS "username",
        JACKPOTS.JACKPOT_POOL_AMOUNT AS "poolAmount",
        (SELECT NAME FROM CASINO_GAMES WHERE ID = JACKPOTS.GAME_ID) AS "gameName",
        JACKPOTS.UPDATED_AT AS "winningTime"
      FROM
        JACKPOTS
      INNER JOIN USERS ON USERS.ID = JACKPOTS.USER_ID
      WHERE
        JACKPOTS.STATUS = 2 AND JACKPOTS.DELETED_AT IS NULL
      ORDER BY
        JACKPOTS.UPDATED_AT DESC
      LIMIT
        10;
    `, {
        type: sequelize.QueryTypes.SELECT
      })
      return {
        success: true,
        jackpotPoolAmount: currentJackpotDetails ? round(+currentJackpotDetails.jackpotPoolAmount, 2).toFixed(2) : 0,
        entryAmount: currentJackpotDetails ? currentJackpotDetails.entryAmount : 0,
        recentJackpotWinners: recentJackpotDetails || null
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
