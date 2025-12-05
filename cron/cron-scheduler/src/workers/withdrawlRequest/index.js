import { JOB_PROCESS_PAY_BY_BANK_WITHDRAWL_REQUEST, withdralRequestQueue } from '@src/queues/withdrawlRequest.queue'
import path from 'path'

withdralRequestQueue.process(JOB_PROCESS_PAY_BY_BANK_WITHDRAWL_REQUEST, 1, path.join(__dirname, './payByBankWithdrawlRequest.worker.js'))
