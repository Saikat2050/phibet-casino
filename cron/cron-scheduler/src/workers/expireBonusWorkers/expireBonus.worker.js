
import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { ExpireBonusService } from '@src/services/bonus/expireBonus.service'

export class ExpireBonusWorker extends WorkerBase {
  async run () {
    try {
      const result = await ExpireBonusService.run()
      return result
    } catch (error) {
      Logger.error('Expire Bonus Worker', { message: 'Expire Bonus Worker', exception: error })
      return { success: false, message: 'Error in Expire Bonus worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await ExpireBonusWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
