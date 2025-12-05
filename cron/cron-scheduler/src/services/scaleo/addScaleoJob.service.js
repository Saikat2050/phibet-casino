import { Logger } from '@src/libs/logger'
import { ServiceBase } from '@src/libs/serviceBase'
import { JOB_PROCESS_SCALEO_DATA, ScaleoQueue } from '@src/queues/scaleo.queue'

export class AddScaleoJobService extends ServiceBase {
  async run () {
    try {
      ScaleoQueue.add(JOB_PROCESS_SCALEO_DATA, { ...this.args }, {
        removeOnComplete: 100
      })
      return { success: true }
    } catch (error) {
      Logger.error('Add Scaleo Job Service Error', { message: 'Add Scaleo Job Service Error', exception: error })
      return { success: false, message: 'ERROR IN ADD SCALEO JOB SERVICE ERROR', data: null, error }
    }
  }
}
