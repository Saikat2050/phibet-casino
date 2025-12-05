import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    email: { type: 'string' },
    username: { type: 'string' }
  }
})

export class CheckUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const email = this.args.email
    const username = this.args.username
    const userModel = this.context.sequelize.models.user

    try {
      const payload = {}
      if (username) {
        const user = await userModel.findOne({ where: { username }, attributes: ['id'] })
        payload.usernameExists = !!user?.id
      }

      if (email) {
        const user = await userModel.findOne({ where: { email }, attributes: ['id'] })
        payload.emailExists = !!user?.id
      }

      return payload
    } catch (error) {
      throw new APIError(error)
    }
  }
}
