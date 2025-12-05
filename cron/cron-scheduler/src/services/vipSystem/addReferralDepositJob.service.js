import { Logger } from '@src/libs/logger'
import { ServiceBase } from '@src/libs/serviceBase'
import { JOB_PROCESS_REFERRAL_DATA, referralQueue } from '@src/queues/referral.queue'

export class AddDepositReferralJobService extends ServiceBase {
  async run () {
    try {
      referralQueue.add(JOB_PROCESS_REFERRAL_DATA, { ...this.args }, {
        removeOnComplete: 100
      })
      return { success: true }
    } catch (error) {
      Logger.error('Add Referral Job Service Error', { message: 'Add Referral Job Service Error', exception: error })
      return { success: false, message: 'ERROR IN Referral JOB SERVICE ERROR', data: null, error }
    }
  }
}
