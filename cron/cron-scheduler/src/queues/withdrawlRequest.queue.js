import { queueFactory } from '@src/libs/factory/queue.factory'

export const withdralRequestQueue = queueFactory.createQueue('WithdrawlRequest-Queue', {
  limiter: {
    max: 1,
    duration: 200
  },
  defaultJobOptions: {
    attempts: 1,
    backoff: 60000
  }
})

export const JOB_PROCESS_PAY_BY_BANK_WITHDRAWL_REQUEST = 'payByBankWithdrawalRequest'
