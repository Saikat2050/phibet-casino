import { sequelize } from '@src/database/models'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'

const schema = {
  type: 'object',
  properties: {
    casinoGameIds: { type: 'array' },
    tournamentId: { type: 'number' }
  },
  required: ['casinoGameIds', 'tournamentId']
}

const constraints = ajv.compile(schema)

export class DeleteTournamentGames extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const casinoGameIds = this.args.casinoGameIds
    const tournamentId = this.args.tournamentId
    const transaction = this.context.sequelizeTransaction
    try {
      await sequelize.models.casinoTournamentGame.destroy({ where: { id: casinoGameIds, tournamentId }, transaction })
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
