import { expireBonusQueue, JOB_PROCESS_EXPIRE_BONUS_DATA } from '@src/queues/expireBonus.queue'
expireBonusQueue.add(JOB_PROCESS_EXPIRE_BONUS_DATA, {}, {
  repeat: { cron: '* 4 * * *' },
  removeOnComplete: 100
})
