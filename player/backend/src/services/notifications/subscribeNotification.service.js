import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    endpoint: { type: 'string' },
    keys: { type: 'object' },
    userId: { type: 'string' }
  },
  required: ['endpoint', 'keys']
})

export class SubscribeNotificationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, endpoint, keys } = this.args
    try {
      const [subscribe, created] = await this.context.sequelize.models.pushNotification.findOrCreate({
        defaults: {
          endpoint,
          keys,
          userId: userId || null
        },
        where: {
          endpoint,
          keys,
          userId: userId || null
        }
      }
      )

      if (!created) return this.addError('NotificationSubscriptionExistErrorType')

      return { status: true, message: 'Notification subscription Done', subscribe }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
