import { APIError } from '@src/errors/api.error'
import { Logger } from '@src/libs/logger'
import { WorkerBase } from '@src/libs/workerBase'
import { CreateLedgerService } from '@src/services/common/createLedger.service'
import { STATUS } from '@src/utils/constants/casinoTournament.constants'
import { LEDGER_PURPOSE, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { sequelize } from '@src/database'

export class CancelTournamentWorker extends WorkerBase {

  async run () {
    const transaction = await sequelize.transaction()

    try {
      console.log(this.args.job.data, "=========")
      const tournamentId = this.args.job.data?.tournamentId
      // const adminUserId = this.args.adminUserId

      const casinoTournament = await this.context.models.casinoTournament.findOne({
        where: { id: tournamentId, status: STATUS.ACTIVE, isActive: true },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
          model: this.context.models.userTournament,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }, {
          model: this.context.models.tournamentCurrency,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }],
        transaction
      })
      if (!casinoTournament) return { success: true, msg: "Tournament does not exists." }

      if (casinoTournament.userTournaments.length < casinoTournament.tournamentCurrencies[0].dataValues.minPlayerLimit) return this.addError('LimitDoesNotExistsErrorType')

      for (const users of Object.entries(casinoTournament.userTournaments)) {
        const wallet = await this.context.models.wallet.findOne({ where: { userId: users[1].dataValues.userId, currencyId: users[1].dataValues.currencyId } })
        const result = await CreateLedgerService.execute({
          userId: users[1].dataValues.userId,
          amount: users[1].dataValues.amountSpent,
          walletId: wallet.id,
          purpose: LEDGER_PURPOSE.TOURNAMENT_CANCEL
        }, this.context)
        if (_.size(result.errors)) return this.mergeErrors(result.errors)

        await this.context.models.transaction.create({
          userId: users[1].dataValues.userId,
          ledgerId: result.result.id,
          // actioneeId: adminUserId,
          status: TRANSACTION_STATUS.COMPLETED
        })
      }
      casinoTournament.isActive = false
      casinoTournament.status = STATUS.CANCELLED
      await casinoTournament.save({ transaction })
      await transaction.commit()
      return { success: true, messages: 'Tournament Cancelled successfully' }
    } catch (error) {
      await transaction.rollback()
      throw new APIError(error)
    }
  }
}

export default async (job, done) => {
  const result = await CancelTournamentWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
