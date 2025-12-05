
import { expireBonusQueue, JOB_PROCESS_EXPIRE_BONUS_DATA } from '@src/queues/expireBonus.queue'
import path from 'path'

expireBonusQueue.process(JOB_PROCESS_EXPIRE_BONUS_DATA, 1, path.join(__dirname, './expireBonus.worker.js'))
