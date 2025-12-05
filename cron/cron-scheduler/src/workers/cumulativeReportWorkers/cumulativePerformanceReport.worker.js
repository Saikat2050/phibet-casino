import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { PerformanceReportService } from '@src/services/reports/performanceReport.service'

export class PerformanceReportWorker extends WorkerBase {
  async run () {
    try {
      const result = await PerformanceReportService.run()
      return result
    } catch (error) {
      Logger.error('Performance Report Worker', { message: 'Performance Report Worker', exception: error })
      return { success: false, message: 'Error in Performance Reports worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await PerformanceReportWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
