import { queueFactory } from '@src/libs/factory/queue.factory'
export const casinoQueue = queueFactory.createQueue('casino-Queue', {
  limiter: {
    max: 1,
    duration: 200
  },
  defaultJobOptions: {
    attempts: 2,
    backoff: 60000
  }
})

export const JOB_PROCESS_ALEA_GAMES = 'loadAleaGames'

export const JOB_PROCESS_ICONIC21_GAMES = 'loadIconic21Games'
