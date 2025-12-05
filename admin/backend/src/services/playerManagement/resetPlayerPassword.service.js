import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { UserBackendAxios } from '@src/libs/axios/userBackend.axios'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
})

export class ResetPlayerPasswordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const user = await sequelize.models.user.findOne({
        attributes: ['email'],
        where: { id: this.args.userId }
      })
      if (!user) return this.addError('UserDoesNotExistsErrorType')
      await UserBackendAxios.sendResetPasswordEmail(user.email)

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
