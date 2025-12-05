import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' }
  },
  required: ['adminUserId']
})

export class GetAdminUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const user = await this.context.sequelize.models.adminUser.findOne({
        attributes: { exclude: ['password', 'updatedAt', 'createdAt'] },
        where: { id: this.args.adminUserId },
        include: [{
          attributes: { exclude: ['updatedAt', 'createdAt'] },
          model: this.context.sequelize.models.permission
        }, {
          attributes: { exclude: ['updatedAt', 'createdAt'] },
          model: this.context.sequelize.models.adminRole
        }]
      })

      if (!user) return this.addError('AdminUserNotFoundErrorType')

      return { user }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
