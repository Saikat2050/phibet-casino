import { APIError } from '@src/errors/api.error'
import { setDataForGame } from '@src/helpers/redis.helper'
import ServiceBase from '@src/libs/serviceBase'
import { SUCCESS_MSG } from '@src/utils/constants/public.constants.utils'
import { config } from 'dotenv'
import { Cache } from '@src/libs/cache'

export class UpdateJackpotPreferenceService extends ServiceBase {
  async run () {
    try {
      const transaction = this.context.sequelizeTransaction
      const userId = this.args.user
      const { status, multiplier = 1 } = this.args

      const user = await this.context.sequelize.models.user.findOne({
        where: { id: userId },
        transaction
      })
      const update = {}
      if (status && !user.isJackpotTermsAccepted) {
        update.isJackpotTermsAccepted = true
        await this.context.sequelize.models.userActivity.create(
          {
            activityType: 'user-jackpot-enabled',
            userId: user.id
          }, { transaction })
      }
      update.isJackpotOptedIn = status
      update.jackpotMultiplier = multiplier
      const [, [updatedUser]] = await this.context.sequelize.models.user.update(update, { where: { id: user.id }, transaction, returning: true })

      const currentJackpotDetails = await Cache.get(`gamePlay-${user.userId}`)
      if (currentJackpotDetails && Object.keys(currentJackpotDetails).length > 0) {
        const redisData = JSON.parse(currentJackpotDetails)
        redisData.user.isJackpotOptedIn = status
        redisData.user.jackpotMultiplier = multiplier
        if (status && !user.isJackpotTermsAccepted) redisData.user.isJackpotOptedIn = true
        const gameToken = JSON.stringify(redisData)
        await setDataForGame(`gamePlay-${user.userId}`, gameToken)
      }

      return { user: updatedUser }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
