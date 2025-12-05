import { casinoQueue, JOB_PROCESS_ALEA_GAMES, JOB_PROCESS_ICONIC21_GAMES } from '@src/queues/casino.queue'

casinoQueue.add(JOB_PROCESS_ALEA_GAMES, {}, {
  repeat: { cron: '0 2 * * *' },
  removeOnComplete: 100
})

casinoQueue.add(JOB_PROCESS_ICONIC21_GAMES, {}, {
  repeat: { cron: '5 2 * * *' },
  removeOnComplete: 100
})
