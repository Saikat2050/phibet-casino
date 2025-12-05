import { trackScaleoEvent } from '@src/helpers/common.helpers'
import { Logger } from '@src/libs/logger'
import { ServiceBase } from '@src/libs/serviceBase'

export class SendScaleoEventService extends ServiceBase {
  async run () {
    try {
      await trackScaleoEvent(this.args)
      return { success: true }
    } catch (error) {
      Logger.error('Send Scaleo Data Job Service Error', { message: 'Send Scaleo Data Job Service Error', exception: error })
      return { success: false, message: 'ERROR IN SEND SCALEO DATA JOB SERVICE ERROR', data: null, error }
    }
  }
}
