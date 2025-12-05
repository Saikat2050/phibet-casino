import { queueFactory } from '@src/libs/factory/queue.factory'

export const referralQueue = queueFactory.createQueue('referral-Queue', {
  limiter: {
    max: 1,
    duration: 200
  },
  defaultJobOptions: {
    attempts: 1,
    backoff: 60000
  }
})

export const JOB_PROCESS_REFERRAL_DATA = 'referralData'
