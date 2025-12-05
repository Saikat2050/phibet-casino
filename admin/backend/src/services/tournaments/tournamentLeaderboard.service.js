import ajv from '../../libs/ajv'
import { ServiceBase } from '../../libs/serviceBase'
import { Op } from 'sequelize'

const schema = {
  type: 'object',
  properties: {
    tournamentId: { type: ['string'] },
    currencyId: { type: 'string', default: '1' },
    search: { type: ['string'] },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 }
  },
  required: ['tournamentId']
}
const constraints = ajv.compile(schema)

export class TournamentLeaderBoardService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      let userSearch
      const { search, page, perPage, tournamentId } = this.args
      const query = { tournamentId, currencyId: this.args.currencyId || 1 }

      if (search) {
        userSearch = { username: { [Op.iLike]: `%${search}%` } }
      }

      const leaderBoard = await this.context.sequelize.models.userTournament.findAndCountAll({
        where: query,
        order: [['winPoints', 'DESC']],
        limit: perPage,
        offset: (page - 1) * perPage,
        include: {
          model: this.context.sequelize.models.user,
          where: userSearch,
          attributes: ['username']
        }
      })

      return { leaderBoard: leaderBoard.rows, page, totalPages: Math.ceil(leaderBoard.count / perPage) }
    } catch (err) {
      this.addError('InternalServerErrorType', err)
    }
  }
}
