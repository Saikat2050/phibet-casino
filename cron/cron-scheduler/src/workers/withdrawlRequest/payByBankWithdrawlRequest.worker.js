import { sequelize } from '@src/database'
import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { PayByBankWithdrawlRequestService } from '@src/services/withdrawlRequest/payByBankWithdrawlRequest.service'

export class PayByBankWithdrawlRequestWorker extends WorkerBase {
  async run () {
    const sequelizeTransaction = await sequelize.transaction()

    try {
      const jobData = this.args.job.data
      const result = await PayByBankWithdrawlRequestService.run(jobData, { sequelizeTransaction })
      await sequelizeTransaction.commit()
      return result
    } catch (error) {
      await sequelizeTransaction.rollback()
      Logger.error('Pay By Bank Withdrawl Request', { message: 'error in worker', exception: error })
      return { success: false, message: 'Error in Pay By Bank Withdrawl Request worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await PayByBankWithdrawlRequestWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
