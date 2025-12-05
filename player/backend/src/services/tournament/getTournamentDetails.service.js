import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tournamentId: { type: 'string' },
    currencyId: { type: 'string' },
    userId: { type: 'string' }
  },
  required: ['tournamentId']
})

export class GetTournamentDetailsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { tournamentId, userId } = this.args
    try {
      const include = [
        {
          attributes: { exclude: ['updatedAt', 'createdAt'] },
          model: this.context.sequelize.models.casinoTournamentGame,
          include: {
            model: this.context.sequelize.models.casinoGame,
            attributes: { exclude: ['updatedAt', 'createdAt'] }
          }
        },
        {
          model: this.context.sequelize.models.tournamentCurrency,
          where: { currencyId: this.args.currencyId },
          attributes: { exclude: ['updatedAt', 'createdAt'] },
          required: true,
          include: [{
            model: this.context.sequelize.models.tournamentPrize,
            attributes: { exclude: ['updatedAt', 'createdAt'] }
          }, {
            model: this.context.sequelize.models.currency,
            attributes: ['code', 'symbol']
          }]
        }]
      if (userId) {
        include.push({
          model: this.context.sequelize.models.userTournament,
          where: { userId },
          attributes: ['id', 'amountSpent', 'points', 'winPoints', 'rebuyLimit'],
          required: false
        })
      }
      const tournament = await this.context.sequelize.models.casinoTournament.findOne({
        where: { id: tournamentId },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include
      })
      if (!tournament) return this.addError('TournamentDoesNotExistErrorType')
      return { tournament }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
