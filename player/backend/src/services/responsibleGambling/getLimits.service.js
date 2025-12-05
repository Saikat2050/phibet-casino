import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
})

export class GetLimitsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const limits = await this.context.sequelize.models.userLimit.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { userId: this.args.userId },
        raw: true
      })
      return {
        limits: limits.map(limit => {
          limit.key = _.camelCase(limit.key)
          return limit
        })
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
