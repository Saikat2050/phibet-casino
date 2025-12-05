
import { JackpotQueue, JOB_JACKPOT_UPDATE } from '@src/queues/jackpot.queue'
import path from 'path'

JackpotQueue.process(JOB_JACKPOT_UPDATE, 1, path.join(__dirname, './jackpot.worker.js'))
