import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
})

export class LogoutService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const transaction = this.context.sequelizeTransaction
      const user = await this.context.sequelize.models.user.findOne({ where: { id: this.args.userId } }, { transaction })
      if (!user.loggedIn) return this.addError('UserNotLoggedInErrorType')

      user.loggedIn = false
      await user.save({ transaction })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
