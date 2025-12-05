import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { RakebackBonusService } from '@src/services/vipSystem/rakebackBonus.service'

export class RakebackBonusWorker extends WorkerBase {
  async run () {

    try {
      const result = await RakebackBonusService.run()

      return result
    } catch (error) {
      Logger.error('Rakeback Bonus Worker', { message: 'Rakeback Bonus Worker', exception: error })
      return { success: false, message: 'Error in Rakeback Bonus Worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await RakebackBonusWorker.run()
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
