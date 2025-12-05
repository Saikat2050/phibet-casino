import { APIError } from '@src/errors/api.error'
import { checkChild, pickChildPermissiosFromParentPermissions } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    parentAdminId: { type: 'string' },
    childAdminId: { type: 'string' },
    permission: { type: 'object' },
    email: { type: 'string', maxLength: 150, format: 'email' },
    lastName: { type: 'string', maxLength: 50, pattern: '^[a-zA-Z]*$' },
    firstName: { type: 'string', maxLength: 50, minLength: 3, pattern: '^[a-zA-Z]*$' },
    username: { type: 'string', maxLength: 100, pattern: '^[A-Za-z][A-Za-z0-9_]{3,50}$' }
  },
  required: ['parentAdminId', 'childAdminId']
})

export class UpdateChildService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const email = this.args.email
    const lastName = this.args.lastName
    const username = this.args.username
    const firstName = this.args.firstName
    const permission = this.args.permission

    const transaction = this.context.sequelizeTransaction
    const adminUserModel = this.context.sequelize.models.adminUser
    try {
      const isChild = await checkChild(this.args.parentAdminId, this.args.childAdminId, transaction)
      if (!isChild) return this.addError('ChildAdminUserNotFoundErrorType')

      const childAdminUser = await adminUserModel.findOne({ where: { id: this.args.childAdminId }, transaction })
      const previousData = childAdminUser.get({ plain: true })
      if (email) {
        const emailExists = await adminUserModel.count({ where: { email }, transaction })
        if (emailExists) return this.addError('EmailAlreadyExistsErrorType')
        childAdminUser.email = email
      }
      if (username) {
        const usernameExists = await adminUserModel.count({ where: { username }, transaction })
        if (usernameExists) return this.addError('UsernameAlreadyExistsErrorType')
        childAdminUser.username = username
      }
      if (lastName) childAdminUser.lastName = lastName
      if (firstName) childAdminUser.firstName = firstName
      if (permission) {
        const parentAdminPermission = await this.context.sequelize.models.permission.findOne({ where: { adminUserId: childAdminUser.parentAdminId }, transaction })
        await this.context.sequelize.models.permission.update({
          permission: pickChildPermissiosFromParentPermissions(permission, parentAdminPermission.permission)
        }, {
          where: { adminUserId: childAdminUser.id },
          transaction
        })

        // delete the jwt token from redis
        // await Cache.del(`admin:${this.args.childAdminId }`)
        const modifiedData = childAdminUser.get({ plain: true })

        logAdminActivity({
          adminUserId: this.args.parentAdminId,
          entityId: this.args.parentAdminId,
          entityType: 'adminUser',
          action: 'update',
          changeTableId: childAdminUser.id,
          changeTableName: 'admin_users',
          previousData: { childAdminUser: previousData },
          modifiedData: { childAdminUser: modifiedData },
          service: 'updateChild',
          category: tableCategoriesMapping.admin_users
        })
      }
      await childAdminUser.save({ transaction })

      return { childAdminUser }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
