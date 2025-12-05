import { optimoveQueue, JOB_OPTIMOVE_DATA } from '@src/queues/optimove.queue'

optimoveQueue.add(JOB_OPTIMOVE_DATA, {}, {
  repeat: { cron: '10 0 * * *' },
  removeOnComplete: 100
})
