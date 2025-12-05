import { Logger } from '@src/libs/logger'
import { ServiceBase } from '@src/libs/serviceBase'
import { JOB_PROCESS_VIP_TIER_UPGRADE_DATA, vipTierUpgradeQueue } from '@src/queues/upgradeTier.queue'

export class AddTierUpgradeJobService extends ServiceBase {
  async run () {
    try {
      vipTierUpgradeQueue.add(JOB_PROCESS_VIP_TIER_UPGRADE_DATA, { ...this.args }, {
        removeOnComplete: 100
      })
      return { success: true }
    } catch (error) {
      Logger.error('Add Tier Upgrade Job Service Error', { message: 'Add Tier Upgrade Job Service Error', exception: error })
      return { success: false, message: 'ERROR IN ADD TIER UPGRADE JOB SERVICE ERROR', data: null, error }
    }
  }
}
