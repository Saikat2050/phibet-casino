import { ServiceBase } from '@src/libs/serviceBase'
import { JOB_PROCESS_ICONIC21_GAMES, casinoQueue } from '@src/queues/casino.queue'

export class Iconic21GamesSeedingJobService extends ServiceBase {
  async run () {
    try {
      casinoQueue.add(JOB_PROCESS_ICONIC21_GAMES, {
        removeOnComplete: 100
      })
      return { success: true }
    } catch (error) {
      return { success: false, message: 'ERROR IN ICONIC21 GAME SEEDING JOB SERVICE ERROR', data: null, error }
    }
  }
}
