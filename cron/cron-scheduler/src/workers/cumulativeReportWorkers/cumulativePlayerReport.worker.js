import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { CumulativePlayerReportService } from '@src/services/reports/cumulativePlayerReport'

export class CumulativePlayerReportWorker extends WorkerBase {
  async run () {
    try {
      const result = await CumulativePlayerReportService.run()
      return result
    } catch (error) {
      Logger.error('Cumulative Player Report Worker', { message: 'Cumulative Player Report Worker', exception: error })
      return { success: false, message: 'Error in Cumulative Player Report Worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await CumulativePlayerReportWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
