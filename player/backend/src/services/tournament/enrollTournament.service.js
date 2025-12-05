
import { APIError } from '@src/errors/api.error'
import { STATUS } from '@src/utils/constants/casinoTournament.constants'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { CreateTransactionService } from '../transaction/createTransaction.service'

const schema = {
  type: 'object',
  properties: {
    tournamentId: { type: 'number' },
    userId: { type: 'number' },
    walletId: { type: 'number' }
  }
}
const constraints = ajv.compile(schema)

export class EnrollTournamentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    try {
      const { tournamentId, userId } = this.args

      const wallet = await this.context.models.wallet.findOne({
        where: { id: this.args.walletId, userId },
        include: {
          model: this.context.models.currency,
          required: true
        }
      })
      if (!wallet) return this.addError('InvalidWalletIdErrorType')

      const casinoTournament = await this.context.sequelize.models.casinoTournament.findOne({
        where: { id: tournamentId, status: STATUS.ACTIVE },
        include: {
          model: this.context.sequelize.models.tournamentCurrency,
          where: { currencyId: wallet.currencyId },
          required: true
        }
      })

      if (!casinoTournament) return this.addError('TournamentDoesNotExistErrorType')
      if (!casinoTournament.isActive) return this.addError('TournamentNotActiveErrorType')
      if (new Date() > casinoTournament.registrationEndDate) return this.addError('RegistrationEndDateErrorType') // need to add dayJs
      if (wallet.amount < casinoTournament.tournamentCurrencies[0].entryFees) return this.addError('BalanceErrorType')
      if (casinoTournament.tagIds) {
        const userTags = await this.context.sequelize.models.userTag.findAll({
          where: { tagId: { [Op.in]: casinoTournament.tagIds }, userId }
        })
        if (userTags.length === 0) return this.addError('InvalidTagErrorType')
      }
      const userEnrolled = await this.context.sequelize.models.userTournament.findOne({
        where: { [Op.and]: { userId, tournamentId } }
      })
      if (userEnrolled) return this.addError('TournamentsAlreadyEnrolledErrorType')

      if (casinoTournament.tournamentCurrencies[0].maxPlayerLimit) {
        const tournamentUsersCount = await this.context.sequelize.models.userTournament.count({
          where: { tournamentId }
        })
        if (tournamentUsersCount > casinoTournament.tournamentCurrencies[0].maxPlayerLimit) return this.addError('TournamentPlayerLimitReachedErrorType')
      }

      const enrollmentData = {
        tournamentId,
        userId,
        currencyId: wallet.currencyId,
        points: casinoTournament.creditPoints,
        amountSpent: casinoTournament.tournamentCurrencies[0].entryFees,
        rebuyLimit: casinoTournament.tournamentCurrencies[0].rebuyLimit
      }
      const userEnrolledTournament = await this.context.sequelize.models.userTournament.create(enrollmentData, { transaction })

      await CreateTransactionService.execute({
        userId,
        amount: casinoTournament.tournamentCurrencies[0].entryFees,
        walletId: wallet.id,
        purpose: LEDGER_PURPOSE.TOURNAMENT_ENROLL
      }, this.context)

      return { userEnrolledTournament, message: 'User enrolled successfully' }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
