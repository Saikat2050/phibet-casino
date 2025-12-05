
import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { UpdateKycStatusService } from '@src/services/idComply/updateKycStatus.service'

export class IDComplyWorker extends WorkerBase {
  async run () {
    try {
      const result = await UpdateKycStatusService.run({})
      return result
    } catch (error) {
      Logger.error('IDComply Service Worker', { message: 'IDComply Service Worker', exception: error })
      return { success: false, message: 'Error in IDComply Service worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await IDComplyWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
