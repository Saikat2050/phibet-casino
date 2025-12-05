import { idComplyQueue, JOB_PROCESS_IDCOMPLY_DATA } from '@src/queues/idComply.queue'
idComplyQueue.add(JOB_PROCESS_IDCOMPLY_DATA, {}, {
  repeat: { cron: '*/1 * * * *' },
  removeOnComplete: 100
})
