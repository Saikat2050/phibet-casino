import { APIError } from '@src/errors/api.error'
import { STATUS } from '@src/utils/constants/casinoTournament.constants'
import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import { ServiceBase } from '../../libs/serviceBase'
import { LEDGER_PURPOSE, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import { CreateLedgerService } from '../ledger/createLedger.service'
import _ from 'lodash'

const schema = {
  type: 'object',
  properties: {
    tournamentId: { type: 'number' }
  },
  required: ['tournamentId']
}

const constraints = ajv.compile(schema)

export class TournamentSettlementService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction

    try {
      const { tournamentId } = this.args
      const adminUserId = this.args.adminUserId
      const casinoTournament = await this.context.sequelize.models.casinoTournament.findOne({
        where: { id: tournamentId, status: STATUS.ACTIVE },
        include: [{
          model: this.context.sequelize.models.tournamentCurrency,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: {
            model: this.context.sequelize.models.tournamentPrize,
            attributes: { exclude: ['updatedAt', 'createdAt'] }

          }
        }]
      })
      if (!casinoTournament) return this.addError('TournamentDoesNotExistErrorType')
      if (casinoTournament.status === STATUS.SETTLED || casinoTournament.status === STATUS.CANCELLED) return this.addError('TournamentSettledOrCancelledErrorType')

      // Getting rank wise mapping prize ex-(rank:prize)
      const prizeDistribution = {}
      casinoTournament.tournamentCurrencies[0]?.tournamentPrizes.forEach(prize => {
        const { rank, amount } = prize.dataValues
        prizeDistribution[rank] = amount
      })
      if (!prizeDistribution) return this.addError('TournamentPrizeNotExistErrorType')

      // Getting top winner of tournament
      const getWinners = await this.context.sequelize.models.userTournament.findAll({
        where: { tournamentId, winPoints: { [Op.gt]: 0 } },
        limit: Object.keys(prizeDistribution).length,
        order: [['winPoints', 'DESC']],
        attributes: ['userId', 'currencyId']
      })
      if (!getWinners[0]) return this.addError('TournamentUserNotExistErrorType')

      // Getting object key of userId and value of prize and currencyId ex - 2:{prize: 80, currencyId: '1'}
      const prizeDistributionMapping = getWinners.reduce((acc, winner, index) => {
        acc[winner.userId] = { prize: prizeDistribution[index + 1], currencyId: winner.currencyId }
        return acc
      }, {})

      for (const [userId, value] of Object.entries(prizeDistributionMapping)) {
        const wallet = await this.context.sequelize.models.wallet.findOne({ where: { userId, currencyId: value.currencyId } })
        const result = await CreateLedgerService.execute({
          userId,
          amount: value.prize,
          walletId: wallet.id,
          purpose: LEDGER_PURPOSE.TOURNAMENT_WIN
        }, this.context)
        if (_.size(result.errors)) return this.mergeErrors(result.errors)

        await this.context.sequelize.models.transaction.create({
          userId,
          ledgerId: result.result.id,
          actioneeId: adminUserId,
          status: TRANSACTION_STATUS.COMPLETED
        }, { transaction })
      }

      casinoTournament.isActive = false
      casinoTournament.status = STATUS.SETTLED
      await casinoTournament.save({ transaction })

      return { prizeDistributionMapping, messages: 'Tournament settlement done' }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
