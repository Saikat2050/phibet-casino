
import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { CumulativeGameReportService } from '@src/services/reports/cumulativeGameReport'

export class CumulativeGameReportWorker extends WorkerBase {
  async run () {
    try {
      const result = await CumulativeGameReportService.run()
      return result
    } catch (error) {
      Logger.error('Cumulative Game Report Worker', { message: 'Cumulative Game Report Worker', exception: error })
      return { success: false, message: 'Error in Cumulative Game Report Worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await CumulativeGameReportWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
