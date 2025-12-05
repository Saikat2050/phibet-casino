
import { casinoQueue, JOB_PROCESS_ALEA_GAMES, JOB_PROCESS_ICONIC21_GAMES } from '@src/queues/casino.queue'
import path from 'path'

casinoQueue.process(JOB_PROCESS_ALEA_GAMES, 1, path.join(__dirname, './aleaGames.worker.js'))

casinoQueue.process(JOB_PROCESS_ICONIC21_GAMES, 1, path.join(__dirname, './iconic21Games.worker.js'))
