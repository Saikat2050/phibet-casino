import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { APPLICATION_PERMISSION } from '@src/utils/constants/permission.constant'

const constraints = ajv.compile({
  type: 'object',
  properties: {

  }
})

export class ResetSuperAdminPermissions extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const superAdminUsers = await this.context.sequelize.models.adminUser.findAll({ where: { adminRoleId: 1 } })

      // if no users
      if (!superAdminUsers || superAdminUsers.length < 1) throw new APIError('NoDataToProcessErrorType')

      await Promise.all(superAdminUsers.map(async (admin) => {
        await this.context.sequelize.models.permission.update({
          permission: APPLICATION_PERMISSION
        }, { where: { adminUserId: admin.id } })
      }))

      return { messgae: 'data loaded sucessfully' }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
