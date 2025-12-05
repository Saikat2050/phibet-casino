import { Logger } from '@src/libs/logger'
import { pubSubRedisClient } from '@src/libs/pubSubRedisClient'
import { ServiceBase } from '@src/libs/serviceBase'
import { JOB_JACKPOT_UPDATE, JackpotQueue } from '@src/queues/jackpot.queue'
import { JACKPOT_STATUS } from '@src/utils/constants/public.constants.utils'
import { sequelize } from '@src/database'
import { Op } from 'sequelize'

export class AddJackpotEntryJobService extends ServiceBase {
  async run () {
    try {
      const { userId, betAmount, gameId, isScActive, jackpotEnabled = false, jackpotMultiplier = 1 } = this.args

      const jackpotDetail = isScActive ? await this.jackpotDetailCaching() : null
      if (jackpotDetail && jackpotEnabled && +betAmount > 0) {
        JackpotQueue.add(JOB_JACKPOT_UPDATE, { userId: +userId, gameId, jackpotMultiplier }, {
          removeOnComplete: 100
        })
      }
      return { success: true }
    } catch (error) {
      Logger.error('Add Jackpot Entry Job Service Error', { message: 'Add Jackpot Entry Job Service Error', exception: error })
      return { success: false, message: 'ERROR IN Jackpot Entry JOB SERVICE ERROR', data: null, error }
    }
  }

  async jackpotDetailCaching () {
    let jackpot = await pubSubRedisClient.client.get('jackpot-details')

    if (!jackpot) {
      jackpot = await sequelize.models.jackpot.findOne({
        where: { status: { [Op.in]: [JACKPOT_STATUS.UPCOMING, JACKPOT_STATUS.RUNNING] } },
        order: [['createdAt', 'ASC']],
        raw: true
      })

      if (!jackpot) return null

      if (jackpot.status === JACKPOT_STATUS.UPCOMING) {
        const startDate = new Date()
        await sequelize.models.jackpot.update(
          { status: JACKPOT_STATUS.RUNNING, startDate },
          { where: { jackpotId: jackpot.jackpotId } }
        )
        jackpot.status = JACKPOT_STATUS.RUNNING
        jackpot.startDate = startDate
      }

      await pubSubRedisClient.client.set('jackpot-details', JSON.stringify(jackpot))
      return jackpot
    }

    if (typeof jackpot === 'string') {
      return JSON.parse(jackpot)
    } else {
      return jackpot
    }
  }
}
