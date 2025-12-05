import { queueFactory } from '@src/libs/factory/queue.factory'
export const VipTierBonusQueue = queueFactory.createQueue('Vip-TierBonus-Queue', {
  limiter: {
    max: 1,
    duration: 200
  },
  defaultJobOptions: {
    attempts: 1,
    backoff: 60000
  }
})

export const JOB_PROCESS_MONTHLY_BONUS_DATA = 'monthlyBonusData'

export const JOB_PROCESS_WEEKLY_BONUS_DATA = 'weeklyBonusData'


export const JOB_PROCESS_RAKEBACK_BONUS_DATA = 'rakebackBonusData'
