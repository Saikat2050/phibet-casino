import { queueFactory } from '@src/libs/factory/queue.factory'
export const JackpotQueue = queueFactory.createQueue('Jackpot Jobs', {
  limiter: {
    max: 1,
    duration: 200
  },
  defaultJobOptions: {
    attempts: 1,
    backoff: 60000
  }
})

export const JOB_JACKPOT_UPDATE = 'JackpotUpdateJob'
