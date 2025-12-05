
import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { UpdateJackpotDataService } from '@src/services/jackpot'
import { sequelize } from '@src/database'
import models from '@src/database/models'

export class JackpotWorker extends WorkerBase {
  async run () {
    const sequelizeTransaction = await sequelize.transaction()
    try {
      const jobData = this.args.job.data
      const result = await UpdateJackpotDataService.execute(jobData, { dbModels: models, sequelize, sequelizeTransaction })
      await sequelizeTransaction.commit()
      return result
    } catch (error) {
      await sequelizeTransaction.rollback()
      Logger.error('Expire Bonus Worker', { message: 'Expire Bonus Worker', exception: error })
      return { success: false, message: 'Error in Expire Bonus worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await JackpotWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
