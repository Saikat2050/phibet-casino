import ajv from '@src/libs/ajv'
import Logger from '@src/libs/logger.js'
import ServiceBase from '@src/libs/serviceBase'
import { TOURNAMENT_RESPONSE } from '@src/utils/constants/casinoTournament.constants.js'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tournamentId: { type: 'number' },
    userId: { type: 'number' }
  },
  required: ['userId', 'tournamentId']
})

export class TournamentGetBalanceService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, tournamentId } = this.args
    try {
      const userTournament = await this.context.sequelize.models.userTournament.findOne({
        where: { userId, tournamentId: tournamentId },
        attributes: ['id', 'points']
      })
      return {
        ...TOURNAMENT_RESPONSE.SUCCESS,
        balance: userTournament.points
      }
    } catch (error) {
      Logger.error('Error in tournament get balanace service', error)
      return TOURNAMENT_RESPONSE.INTERNAL_SERVER_ERROR
    }
  }
}
