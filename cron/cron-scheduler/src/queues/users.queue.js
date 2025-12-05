import { queueFactory } from '@src/libs/factory/queue.factory'

export const usersQueue = queueFactory.createQueue('users-Queue', {
  limiter: {
    max: 1,
    duration: 200
  },
  defaultJobOptions: {
    attempts: 1,
    backoff: 60000
  }
})

export const JOB_PROCESS_USER_LIMIT = 'userLimitActivity'
