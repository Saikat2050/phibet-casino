import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'username', 'email', 'phone', 'dateOfBirth'], default: 'id' }
  },
  required: ['userId']
})

export class GetDuplicatePlayersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage

    try {
      const player = await this.context.sequelize.models.user.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
        where: { id: this.args.userId },
        raw: true
      })
      if (!player) return this.addError('UserDoesNotExistsErrorType')

      const players = await sequelize.models.user.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
        where: {
          id: { [Op.ne]: player.id },
          [Op.or]: [
            Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'ilike', `%${player.firstName} ${player.lastName}%`),
            player.email ? { email: { [Op.iLike]: `%${player.email.split('@')[0]}%` } } : {},
            { phone: { [Op.like]: player.phone ? player.phone : ' ' } },
            { lastLoggedInIp: { [Op.eq]: player.lastLoggedInIp } },
            { username: { [Op.iLike]: `%${player.username}%` } }
          ]
        },
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [[this.args.orderBy, this.args.order]]
      })

      return { players: players.rows, page, totalPages: Math.ceil(players.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
