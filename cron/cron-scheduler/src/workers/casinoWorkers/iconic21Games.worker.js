
import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { LoadIconic21GamesService } from '@src/services/casino/iconic21/loadIconic21Games.service'

export class Iconic21GamesWorker extends WorkerBase {
  async run () {
    try {
      const result = await LoadIconic21GamesService.run()
      return result
    } catch (error) {
      Logger.error('Iconic Games Worker', { message: 'Iconic21 Games Worker', exception: error })
      return { success: false, message: 'Error in Iconic21 Games Worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await Iconic21GamesWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
