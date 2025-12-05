import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { UpgradeUserTierService } from '@src/services/vipSystem/upgradeUserTier.service'

export class VipTierWorker extends WorkerBase {
  async run () {
    try {
      const jobData = this.args.job.data
      const result = await UpgradeUserTierService.run({ ...jobData })
      return result
    } catch (error) {
      Logger.error('Vip Tier Worker', { message: 'Vip Tier Worker', exception: error })
      return { success: false, message: 'Error in Vip Tier Worker worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await VipTierWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
