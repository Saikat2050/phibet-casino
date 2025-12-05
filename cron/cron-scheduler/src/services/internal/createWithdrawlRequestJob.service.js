import { ServiceBase } from '@src/libs/serviceBase'
import { JOB_PROCESS_PAY_BY_BANK_WITHDRAWL_REQUEST, withdralRequestQueue } from '@src/queues/withdrawlRequest.queue'

export class CreateWithdrawlRequestJobService extends ServiceBase {
  async run () {
    try {
      withdralRequestQueue.add(JOB_PROCESS_PAY_BY_BANK_WITHDRAWL_REQUEST, { ...this.args }, {
        removeOnComplete: 100
      })
      return { success: true }
    } catch (error) {
      return { success: false, message: 'ERROR IN ADD PAY BY BANK WITHDRAWL REQUEST JOB SERVICE ERROR', data: null, error }
    }
  }
}
