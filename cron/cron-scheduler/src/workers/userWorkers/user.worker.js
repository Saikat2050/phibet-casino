import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { CheckUserLimitService } from '@src/services/user/checkLimts.service'

export class UsersWorker extends WorkerBase {
  async run () {
    try {
      const jobData = this.args.job.data
      const result = await CheckUserLimitService.run({ ...jobData })
      return result
    } catch (error) {
      Logger.error('Users Worker', { message: 'Users Worker', exception: error })
      return { success: false, message: 'Error in Users Worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await UsersWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
