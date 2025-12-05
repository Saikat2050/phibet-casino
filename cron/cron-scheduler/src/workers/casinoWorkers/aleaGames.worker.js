
import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { AleaGetPagesService } from '@src/services/casino/alea/getAleaGames.service'

export class AleaGamesWorker extends WorkerBase {
  async run () {
    try {
      const result = await AleaGetPagesService.run()
      return result
    } catch (error) {
      Logger.error('Alea Games Worker', { message: 'Alea Games Worker', exception: error })
      return { success: false, message: 'Error in Alea Games Worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await AleaGamesWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
