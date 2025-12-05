import { ServiceBase } from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { STATUS } from '@src/utils/constants/casinoTournament.constants'
import { CreateLedgerService } from '../ledger/createLedger.service'
import { LEDGER_PURPOSE, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tournamentId: { type: 'string' }
  },
  required: ['tournamentId']
})

export class CancelTournamentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction

    try {
      const tournamentId = this.args.tournamentId
      const adminUserId = this.args.adminUserId

      const casinoTournament = await this.context.sequelize.models.casinoTournament.findOne({
        where: { id: tournamentId, status: { [Op.in]: [STATUS.ACTIVE, STATUS.INACTIVE] } },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
          model: this.context.sequelize.models.userTournament,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          required: false
        }, {
          model: this.context.sequelize.models.tournamentCurrency,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }],
        transaction
      })
      if (!casinoTournament) return this.addError('TournamentDoesNotExistErrorType')

      // if (casinoTournament.userTournaments.length < casinoTournament.tournamentCurrencies[0].dataValues.minPlayerLimit) return this.addError('LimitDoesNotExistsErrorType')

      for (const users of Object.entries(casinoTournament.userTournaments)) {
        const wallet = await this.context.sequelize.models.wallet.findOne({ where: { userId: users[1].dataValues.userId, currencyId: users[1].dataValues.currencyId } })
        const result = await CreateLedgerService.execute({
          userId: users[1].dataValues.userId,
          amount: users[1].dataValues.amountSpent,
          walletId: wallet.id,
          purpose: LEDGER_PURPOSE.TOURNAMENT_CANCEL
        }, this.context)
        if (_.size(result.errors)) return this.mergeErrors(result.errors)

        await this.context.sequelize.models.transaction.create({
          userId: users[1].dataValues.userId,
          ledgerId: result.result.id,
          actioneeId: adminUserId,
          status: TRANSACTION_STATUS.COMPLETED
        }, { transaction })
      }
      casinoTournament.isActive = false
      casinoTournament.status = STATUS.CANCELLED
      await casinoTournament.save({ transaction })

      return { casinoTournament, messages: 'Tournament Cancelled successfully' }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
