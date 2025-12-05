
import { JOB_PROCESS_REFERRAL_DATA, referralQueue } from '@src/queues/referral.queue'
import path from 'path'

referralQueue.process(JOB_PROCESS_REFERRAL_DATA, 1, path.join(__dirname, './referral.worker.js'))
