import { APIError } from '@src/errors/api.error'
import { checkChild } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    parentAdminId: { type: 'string' },
    childAdminId: { type: 'string' }
  },
  required: ['childAdminId']
})

export class ToggleChildService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const isChild = await checkChild(this.args.parentAdminId, this.args.childAdminId)
      if (!isChild) return this.addError('ChildAdminUserNotFoundErrorType')

      const childAdmiUser = await this.context.sequelize.models.adminUser.findOne({ where: { id: this.args.childAdminId } })
      const previousData = { isActive: childAdmiUser?.isActive }
      childAdmiUser.isActive = !childAdmiUser.isActive
      // await Cache.del(`admin:${this.args.childAdminId }`)
      await childAdmiUser.save()
      const modifiedData = { isActive: childAdmiUser?.isActive }
      logAdminActivity({
        adminUserId: this.args.parentAdminId,
        entityId: childAdmiUser?.id,
        entityType: 'adminUser',
        action: 'update',
        changeTableId: childAdmiUser?.id,
        changeTableName: 'admin_users',
        previousData: { adminUser: previousData },
        modifiedData: { adminUser: modifiedData },
        service: 'toggle child',
        category: tableCategoriesMapping.admin_users

      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
