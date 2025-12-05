import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    limit: { type: 'number' },
    timeSpan: { type: 'number' }
  },
  required: ['userId']
})

export class GetUserActivityService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const users = await this.context.sequelize.models.userActivity.findAll({
        where: {
          userId: this.args.userId,
          createdAt: {
            [Op.gte]: new Date(Date.now() - (this.args.timeSpan * 60 * 1000))
          }
        },
        order: [['createdAt', 'DESC']],
        limit: this.args.limit
      })
      return users
    } catch (error) {
      throw new APIError(error)
    }
  }
}
