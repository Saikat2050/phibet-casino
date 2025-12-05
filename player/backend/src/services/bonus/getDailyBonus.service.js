import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { sequelize } from '@src/database/models'
import { Op } from 'sequelize'
import { Cache } from '@src/libs/cache'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
export class GetDailyBonusService extends ServiceBase {
  async run () {
    try {
      const userId = this.args.userId
      let dailyBonus = await Cache.get(CACHE_KEYS.DAILY_BONUS)

      if (!dailyBonus || (dailyBonus && !Object.keys(dailyBonus)?.length)) {

        dailyBonus = await this.context.sequelize.models.bonus.findOne({
          where: {
            bonusType: BONUS_TYPES.DAILY_BONUS,
            isActive: true
          },
          include: {
            model: this.context.models.bonusCurrency,
            include: {
              model: this.context.models.currency,
              where: { code: { [Op.in]: ['GC', 'BSC'] } },
              required: true
            }
          }
        })

        await Cache.set(CACHE_KEYS.DAILY_BONUS, dailyBonus)
      }

      if (dailyBonus) {
        async function getClaimedDailyBonusForLast24Hrs (userId, bonusId) {
          try {
            const [hasClaimedDailyBonusForLast24Hrs] = await sequelize.query(
              ` SELECT id
                FROM user_bonus
                WHERE user_id = ${userId}
                  AND bonus_id = ${bonusId}
                  AND claimed_at >= NOW() - INTERVAL '24 HOURS'
                ORDER BY claimed_at DESC
                LIMIT 1;
              `
            )
            return hasClaimedDailyBonusForLast24Hrs || 0
          } catch (error) {
            throw new APIError(error)
          }
        }
        const hasClaimedDailyBonusForLast24Hrs = await getClaimedDailyBonusForLast24Hrs(userId, dailyBonus.id)
        if (hasClaimedDailyBonusForLast24Hrs.length > 0) {
          return { dailyBonus: null }
        } else {
          return { dailyBonus: dailyBonus }
        }
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
