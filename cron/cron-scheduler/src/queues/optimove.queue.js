import { queueFactory } from '@src/libs/factory/queue.factory'

export const optimoveQueue = queueFactory.createQueue('optimove-Queue', {
  defaultJobOptions: {
    attempts: 10,
    backoff: 60000,
    removeOnComplete: 100
  }
})

export const JOB_OPTIMOVE_DATA = 'OptimoveData'
export const JOB_UPDATE_OPTIMOVE_DATA = 'UpdateOptimoveData'
