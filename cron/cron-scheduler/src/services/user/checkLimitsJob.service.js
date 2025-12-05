import { Logger } from '@src/libs/logger'
import { ServiceBase } from '@src/libs/serviceBase'
import { JOB_PROCESS_USER_LIMIT, usersQueue } from '@src/queues/users.queue'

export class CheckLimitsJobService extends ServiceBase {
  async run () {
    try {
      usersQueue.add(JOB_PROCESS_USER_LIMIT, { ...this.args }, {
        removeOnComplete: 100
      })

      return { success: true }
    } catch (error) {
      Logger.error('Check User Limit and add Activity Job Service Error', { message: 'Check User Limit and add Activity Job Service Error', exception: error })
      return { success: false, message: 'ERROR IN Check User Limit and add Activity JOB SERVICE ERROR', data: null, error }
    }
  }
}
