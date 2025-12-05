import { ServiceBase } from '@src/libs/serviceBase'
import { JOB_PROCESS_ALEA_GAMES, casinoQueue } from '@src/queues/casino.queue'

export class AleaGamesSeedingJobService extends ServiceBase {
  async run () {
    try {
      casinoQueue.add(JOB_PROCESS_ALEA_GAMES, {
        removeOnComplete: 100
      })
      return { success: true }
    } catch (error) {
      return { success: false, message: 'ERROR IN ALEA GAME SEEDING JOB SERVICE ERROR', data: null, error }
    }
  }
}
