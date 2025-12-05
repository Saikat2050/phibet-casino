import { sequelize } from '@src/database'
import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { AvailReferralDepositService } from '@src/services/vipSystem/availReferralDeposit.service'

export class ReferralWorker extends WorkerBase {
  async run () {
    const transaction = await sequelize.transaction()
    Logger.info('coming in worker for avail referral deposit')
    try {
      const jobData = this.args.job.data
      const result = await AvailReferralDepositService.run({ ...jobData, seqTransaction: transaction })
      await transaction.commit()
      return result
    } catch (error) {
      Logger.error('Referral Worker', { message: 'Referral Worker', exception: error })
      await transaction.rollback()
      return { success: false, message: 'Error in Referral Worker worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await ReferralWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
