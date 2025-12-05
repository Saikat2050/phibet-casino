import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    playerId: { type: 'string' },
    perPage: { type: 'integer', minimum: 1 },
    page: { type: 'integer', minimum: 1 }
  },
  required: ['playerId']
})

export class GetPlayerCommentsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const perPage = this.args.perPage || 10
      const page = this.args.page || 1
      const offset = (page - 1) * perPage
      const { count, rows } = await this.context.sequelize.models.userComment.findAndCountAll({
        where: { userId: this.args.playerId },
        include: [{
          model: this.context.sequelize.models.adminUser,
          attributes: ['id', 'firstName', 'lastName', 'username', 'email']
        }],
        order: [['createdAt', 'DESC']],
        limit: perPage,
        offset
      })
      return {
        total: count,
        page,
        perPage,
        comments: rows.map(comment => {
          const plain = comment.get ? comment.get({ plain: true }) : comment
          return {
            id: plain.id,
            userId: plain.userId,
            title: plain.title,
            comment: plain.comment,
            createdAt: plain.createdAt,
            updatedAt: plain.updatedAt,
            commenter: plain.adminUser
              ? {
                  id: plain.adminUser.id,
                  firstName: plain.adminUser.firstName,
                  lastName: plain.adminUser.lastName,
                  username: plain.adminUser.username,
                  email: plain.adminUser.email
                }
              : null
          }
        })
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
