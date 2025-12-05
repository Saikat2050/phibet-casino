import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { STATUS } from '@src/utils/constants/casinoTournament.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tournamentId: { type: 'number' }
  },
  required: ['tournamentId']
})

export class ToggleTournamentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const tournament = await this.context.sequelize.models.casinoTournament.findOne({
        attributes: ['id', 'status'],
        where: { id: this.args.tournamentId }
      })
      if (!tournament) return this.addError('TournamentDoesNotExistErrorType')

      if (tournament.status === STATUS.ACTIVE) tournament.status = STATUS.INACTIVE
      if (tournament.status === STATUS.INACTIVE) tournament.status = STATUS.ACTIVE
      await tournament.save()

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
