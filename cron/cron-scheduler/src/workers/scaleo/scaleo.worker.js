
import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { SendScaleoEventService } from '@src/services/scaleo/sendScaleoEvent.service'

export class ScaleoWorker extends WorkerBase {
  async run () {
    try {
      const jobData = this.args.job.data
      const result = await SendScaleoEventService.run({ ...jobData })

      return result
    } catch (error) {
      Logger.error('Send Scaleo Event Service Worker', { message: 'Send Scaleo Event Service Worker', exception: error })
      return { success: false, message: 'Error in Send Scaleo Event Service worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await ScaleoWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
