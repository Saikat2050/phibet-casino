import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { ProvideDataService } from '@src/services/optimove/provideData.service'
import { config } from '@src/configs/config'

export class ProvideDataWorker extends WorkerBase {
  async run () {
    if (config.get('env') !== 'production') return { success: true, message: 'No Data has been sent' }
    try {
      const jobData = this.args.job.data
      const result = await ProvideDataService.run({ jobData })
      return result
    } catch (error) {
      Logger.error('Provide Data Worker', { message: 'Provide Data Worker', exception: error })
      return { success: false, message: 'Error in Provide Data Worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await ProvideDataWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
