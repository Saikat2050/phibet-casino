import { VipTierBonusQueue, JOB_PROCESS_WEEKLY_BONUS_DATA, JOB_PROCESS_MONTHLY_BONUS_DATA, JOB_PROCESS_RAKEBACK_BONUS_DATA } from '@src/queues/vipTierBonus.queue'

// VipTierBonusQueue.add(JOB_PROCESS_WEEKLY_BONUS_DATA, {}, {
//   repeat: { cron: '0 0 * * 1' }, // cron will run every monday
//   removeOnComplete: 100
// })

VipTierBonusQueue.add(JOB_PROCESS_MONTHLY_BONUS_DATA, {}, {
  repeat: { cron: '0 0 1 * *' }, // At 00:00 (midnight) on the 1st day of each month
  removeOnComplete: 100
})

VipTierBonusQueue.add(JOB_PROCESS_RAKEBACK_BONUS_DATA, {}, {
  repeat: { cron: '0 0 1 * *' }, // At 00:00 (midnight) every day
  removeOnComplete: 100
})
  // repeat: { cron: '0 0 * * 1' }, // cron will run every monday

  // repeat: { cron: '0 0 1 * *' }, // At 00:00 (midnight) on the 1st day of each month

  // repeat: { cron: '*/5 * * * *' }, // Every 5 minutes
