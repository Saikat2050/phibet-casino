import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    search: { type: 'string' },
    language: { type: 'string' },
    status: { type: 'string' },
    page: { type: 'string', default: 1 },
    perPage: { type: 'string', default: 10 }
  }
})

export class GetTournamentsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, search, perPage, userId, status } = this.args
    const where = {}
    let include
    try {
      where.isActive = true
      if (search) where.name = { EN: { [Op.iLike]: `%${search}%` } }
      if (status) where.status = { [Op.in]: status.split(',') }
      if (userId) {
        include = {
          model: this.context.sequelize.models.userTournament,
          where: { userId },
          attributes: ['id'],
          required: false
        }
        const userTags = await this.context.sequelize.models.userTag.findAll({
          where: { userId },
          attributes: [],
          include: {
            model: this.context.sequelize.models.tag,
            where: { isActive: true },
            attributes: ['id'],
            required: true
          }
        })
        const userTagIds = userTags.map(userTag => parseInt(userTag.tag.id))
        if (userTagIds) where.tagIds = { [Op.overlap]: userTagIds }
      }
      const casinoTournaments = await this.context.sequelize.models.casinoTournament.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [['status', 'ASC'], ['registrationEndDate', 'DESC']],
        include
      })

      return { userId, tournaments: casinoTournaments.rows, page, totalPages: Math.ceil(casinoTournaments.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
