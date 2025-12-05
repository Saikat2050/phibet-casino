
import { APIError } from '@src/errors/api.error'
import { STATUS } from '@src/utils/constants/casinoTournament.constants'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { CreateTransactionService } from '../transaction/createTransaction.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tournamentId: { type: 'number' },
    userId: { type: 'number' },
    walletId: { type: 'number' }
  }
})

export class RebuyTournamentPointsService extends ServiceBase {
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
          where: { isActive: true },
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
      if (wallet.amount < casinoTournament.tournamentCurrencies[0].rebuyFees) return this.addError('BalanceErrorType')

      const userEnrolled = await this.context.sequelize.models.userTournament.findOne({
        where: { [Op.and]: { userId, tournamentId, currencyId: wallet.currencyId } }
      })
      if (!userEnrolled) return this.addError('NotEnrolledInTournamentErrorType')
      if (userEnrolled.rebuyLimit === 0) return this.addError('NoRebuyLimitErrorType')

      userEnrolled.amountSpent += casinoTournament.tournamentCurrencies[0].rebuyFees
      userEnrolled.rebuyLimit -= 1
      userEnrolled.points += casinoTournament.creditPoints
      await userEnrolled.save({ transaction })

      await CreateTransactionService.execute({
        userId,
        amount: casinoTournament.tournamentCurrencies[0].rebuyFees,
        walletId: wallet.id,
        purpose: LEDGER_PURPOSE.TOURNAMENT_REBUY
      }, this.context)

      return { message: 'User rebuyed points successfully' }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
