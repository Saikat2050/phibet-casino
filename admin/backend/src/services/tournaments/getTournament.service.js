import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string' },
    language: { type: 'string' },
    status: { type: 'string' },
    page: { type: 'string', default: 1 },
    perPage: { type: 'string', default: 10 },
    tagIds: { type: 'string' }
  }
})

export class GetTournamentsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, search, status, perPage, tagIds } = this.args
    try {
      const where = {}
      if (status) where.status = status
      if (search) where.name = { EN: { [Op.iLike]: `%${search}%` } }
      if (tagIds) where.tagIds = { [Op.overlap]: tagIds.split(',') }

      const casinoTournaments = await this.context.sequelize.models.casinoTournament.findAndCountAll({
        attributes: { exclude: ['updatedAt'] },
        where,
        include: {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.tournamentCurrency
        },
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [['createdAt', 'DESC']]
      })

      return { casinoTournaments: casinoTournaments.rows, page, totalPages: Math.ceil(casinoTournaments.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
