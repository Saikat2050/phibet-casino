import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string' },
    language: { type: 'string' },
    tournamentId: { type: 'string' },
    currencyId: { type: 'string' },
    isActive: { type: 'boolean' },
    page: { type: 'string', default: 1 },
    perPage: { type: 'string', default: 10 }
  },
  required: ['tournamentId', 'currencyId']
})

export class GetLeaderBoardService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, search, isActive, perPage } = this.args
    const where = { tournamentId: this.args.tournamentId, currencyId: this.args.currencyId }
    try {
      if (isActive) where.isActive = isActive
      if (search) where.name = { EN: { [Op.iLike]: `%${search}%` } }

      const casinoTournaments = await this.context.sequelize.models.userTournament.findAndCountAll({
        attributes: { exclude: ['updatedAt'] },
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [['winPoints', 'DESC'], ['createdAt', 'ASC']],
        include: [
          {
            model: this.context.sequelize.models.user,
            attributes: ['username']
          },
          {
            model: this.context.sequelize.models.currency,
            attributes: ['code', 'name']
          }
        ]
      })

      return { leaderboard: casinoTournaments.rows, page, totalPages: Math.ceil(casinoTournaments.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
