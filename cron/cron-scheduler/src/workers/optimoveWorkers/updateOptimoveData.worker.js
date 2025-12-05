import { WorkerBase } from '@src/libs/workerBase'
import { OptimoveGamesDataService } from '@src/services/optimove/optimoveGamesData.service'
import { OptimoveTransactionDataService } from '@src/services/optimove/optimoveTransactionData.service'
import { OptimoveUserDataService } from '@src/services/optimove/optimoveUserData.service'
import { OptimoveGamesDetailsDataService } from '@src/services/optimove/optimoveGamesDetailsData.service'
import { Logger } from '@src/libs/logger'

export class UpdateOptimoveDataWorker extends WorkerBase {
  async run () {
    let result
    try {
      const { type, ...jobData } = this.args.job.data
      switch (type) {
        case 'CUSTOMER_DATA': {
          result = await OptimoveUserDataService.run({ jobData })
          break
        }
        case 'TRANSACTION_DATA': {
          result = await OptimoveTransactionDataService.run({ jobData })
          break
        }
        case 'GAMES_DATA': {
          result = await OptimoveGamesDataService.run({ jobData })
          break
        }
        case 'GAMES_DETAILS_DATA': {
          result = await OptimoveGamesDetailsDataService.run({ jobData })
          break
        }
        default:
          result = true
      }
      return result
    } catch (error) {
      Logger.error('Update Optimove Data Worker', { message: 'Update Optimove Data Worker', exception: error })
      return { success: false, message: 'Error in Update Optimove Data Worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await UpdateOptimoveDataWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
