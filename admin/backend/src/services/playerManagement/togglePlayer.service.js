import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import { ServiceBase } from '@src/libs/serviceBase'
import { emitLogOut } from '@src/socket-resources/emitters/logout.emitter'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    userIds: { type: 'array' },
    isActive: { type: 'boolean' }
  },
  required: ['userIds']
})

export class TogglePlayerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const promise = []
      const isActive = this.args.isActive
      const user = await sequelize.models.user.findAll({
        attributes: ['id', 'isActive', 'emailVerified'],
        where: { id: { [Op.in]: this.args.userIds } }
      })

      if (!user) return this.addError('UserDoesNotExistsErrorType')
      if (!isActive) {
        for (const id of this.args.userIds) {
          emitLogOut(id, { logout: true })
          promise.push(Cache.destroyOldSessions(id))
        }
      }

      await sequelize.models.user.update(
        { isActive },
        {
          where: { id: { [Op.in]: this.args.userIds } }
        }
      )

      if (promise?.length) Promise.all(promise)

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: this.args.userIds,
        entityType: 'user',
        action: 'update',
        changeTableId: this.args.userIds,
        changeTableName: 'users',
        previousData: { isActive: !isActive },
        modifiedData: { isActive: isActive },
        service: 'togglePlayer',
        category: tableCategoriesMapping.users
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
