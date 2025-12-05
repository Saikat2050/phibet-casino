import { sequelize } from '@src/database'
import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { MonthlyBonusService } from '@src/services/vipSystem/monthlyBonus.service'

export class MonthlyBonusWorker extends WorkerBase {
  async run () {
    const transaction = await sequelize.transaction()
    try {
      const result = await MonthlyBonusService.run({ seqTransaction: transaction })
      await transaction.commit()
      return result
    } catch (error) {
      await transaction.rollback()
      Logger.error('Monthly Bonus Worker', { message: 'Monthly Bonus Worker', exception: error })
      return { success: false, message: 'Error in Monthly Bonus Worker', data: null, error }
    }
  }
}

export default async (job, done) => {
  const result = await MonthlyBonusWorker.run()
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
