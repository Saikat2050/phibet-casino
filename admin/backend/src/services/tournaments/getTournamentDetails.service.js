import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tournamentId: { type: 'string' }
  },
  required: ['tournamentId']
})

export class GetTournamentDetailsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { tournamentId } = this.args
    let tags = []
    try {
      const options = { where: { id: tournamentId }, attributes: { exclude: ['createdAt', 'updatedAt'] } }
      options.include = [{
        attributes: { exclude: ['updatedAt', 'createdAt'] },
        model: this.context.sequelize.models.casinoTournamentGame,
        include: {
          model: this.context.sequelize.models.casinoGame,
          attributes: { exclude: ['updatedAt', 'createdAt'] }
        }
      }, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        model: this.context.sequelize.models.tournamentCurrency,
        include: {
          model: this.context.sequelize.models.tournamentPrize,
          attributes: { exclude: ['updatedAt', 'createdAt'] }
        }
      }, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        model: this.context.sequelize.models.tournamentTransaction
      }, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        model: this.context.sequelize.models.userTournament,
        include: {
          model: this.context.sequelize.models.user,
          attributes: { exclude: ['updatedAt', 'createdAt'] }
        }
      }]
      const tournament = await this.context.sequelize.models.casinoTournament.findOne(options)
      if (!tournament) return this.addError('TournamentDoesNotExistErrorType')
      if (tournament.tagIds) {
        tags = await this.context.sequelize.models.tag.findAll({
          where: { id: tournament.tagIds }
        })
      }
      return { tournament, tags }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
