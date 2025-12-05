import { queueFactory } from '@src/libs/factory/queue.factory'

export const vipTierUpgradeQueue = queueFactory.createQueue('vipTierUpgrade-Queue', {
  limiter: {
    max: 1,
    duration: 200
  },
  defaultJobOptions: {
    attempts: 1,
    backoff: 60000
  }
})

export const JOB_PROCESS_VIP_TIER_UPGRADE_DATA = 'vipTierUpgradeData'
