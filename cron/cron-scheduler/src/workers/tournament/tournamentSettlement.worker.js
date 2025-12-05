import { APIError } from '@src/errors/api.error'
import { WorkerBase } from '@src/libs/workerBase'
import { CreateLedgerService } from '@src/services/common/createLedger.service'
import { STATUS } from '@src/utils/constants/casinoTournament.constants'
import { LEDGER_PURPOSE, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { Op } from 'sequelize'
import { sequelize } from '@src/database'

export class TournamentSettlementWorker extends WorkerBase {

  async run () {
    const transaction = await sequelize.transaction()

    try {
      const tournamentId = this.args.job.data?.tournamentId
      const casinoTournament = await this.context.models.casinoTournament.findOne({
        where: { id: tournamentId },
        include: [{
          model: this.context.models.tournamentCurrency,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: {
            model: this.context.models.tournamentPrize,
            attributes: { exclude: ['updatedAt', 'createdAt'] }

          }
        }]
      })
      if (!casinoTournament) return { success: true, msg: "Tournament does not exists." }
      if (casinoTournament.status === STATUS.SETTLED || casinoTournament.status === STATUS.CANCELLED) return this.addError('TournamentSettledOrCancelledErrorType')

      // Getting rank wise mapping prize ex-(rank:prize)
      const prizeDistribution = {}
      casinoTournament.tournamentCurrencies[0]?.tournamentPrizes.forEach(prize => {
        const { rank, amount } = prize.dataValues
        prizeDistribution[rank] = amount
      })
      if (!prizeDistribution) return { success: true, msg: "Tournament does not exists." }

      // Getting top winner of tournament
      const getWinners = await this.context.models.userTournament.findAll({
        where: { tournamentId, winPoints: { [Op.gt]: 0 } },
        limit: Object.keys(prizeDistribution).length,
        order: [['winPoints', 'DESC']],
        attributes: ['userId', 'currencyId']
      })
      if (!getWinners[0]) return { success: true, msg: "Tournament User does not exists." }

      // Getting object key of userId and value of prize and currencyId ex - 2:{prize: 80, currencyId: '1'}
      const prizeDistributionMapping = getWinners.reduce((acc, winner, index) => {
        acc[winner.userId] = { prize: prizeDistribution[index + 1], currencyId: winner.currencyId }
        return acc
      }, {})

      for (const [userId, value] of Object.entries(prizeDistributionMapping)) {
        const wallet = await this.context.models.wallet.findOne({ where: { userId, currencyId: value.currencyId } })
        console.log(wallet)
        const result = await CreateLedgerService.execute({
          userId,
          amount: value.prize,
          walletId: wallet.id,
          purpose: LEDGER_PURPOSE.TOURNAMENT_WIN
        }, this.context)
        if (_.size(result.errors)) return this.mergeErrors(result.errors)

        await this.context.models.transaction.create({
          userId,
          ledgerId: result.result.id,
          status: TRANSACTION_STATUS.COMPLETED
        }, { transaction })
      }

      casinoTournament.isActive = false
      casinoTournament.status = STATUS.SETTLED
      await casinoTournament.save({ transaction })
      await transaction.commit()

      return { prizeDistributionMapping, messages: 'Tournament settlement done' }
    } catch (error) {
      await transaction.rollback()
      throw new APIError(error)
    }
  }
}

export default async (job, done) => {
  const result = await TournamentSettlementWorker.run({ job })
  if (!result.success) done(new Error('Something went wrong'))
  return done(null, result)
}
