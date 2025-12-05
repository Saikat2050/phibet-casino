import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { CumulativeBonusReportService } from '@src/services/reports/bonusReport.service'

export class CumulativeBonusDataReportWorker extends WorkerBase {
  async run () {
    try {
      const result = await CumulativeBonusReportService.run()
      return result
    } catch (error) {
      Logger.error('Cumulative Bonus Report Data Worker', { message: 'Cumulative Bonus Report Data Worker', exception: error })
      return { success: false, message: 'Error in Cumulative Bonus Report Data Worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await CumulativeBonusDataReportWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
