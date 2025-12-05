import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    activityType: { type: 'string' }
  },
  required: ['userId']
})

export class CreateUserAcitivityService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const userActivity = await this.context.sequelize.models.userActivity.create({
        userId: this.args.userId,
        activityType: this.args.activityType
      })

      return userActivity
    } catch (error) {
      throw new APIError(error)
    }
  }
}
