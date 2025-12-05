import { sequelize } from '@src/database'
import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { WeeklyBonusService } from '@src/services/vipSystem/weeklyBonus.service'

export class WeeklyBonusWorker extends WorkerBase {
  async run () {
    const transaction = await sequelize.transaction()
    try {
      const result = await WeeklyBonusService.run({ seqTransaction: transaction })
      await transaction.commit()
      return result
    } catch (error) {
      await transaction.rollback()
      Logger.error('Weekly Bonus Worker', { message: 'weekly Bonus Worker', exception: error })
      return { success: false, message: 'Error in weekly Bonus Worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await WeeklyBonusWorker.run()
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
