import { appConfig } from '@src/configs'
import { APIError } from '@src/errors/api.error'
import { checkChild, pickChildPermissiosFromParentPermissions } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import bcrypt from 'bcrypt'
import { Op } from 'sequelize'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    parentAdminId: { type: 'string' },
    adminRoleId: { type: 'string' },
    phone: { type: 'string' },
    permission: { type: 'object', default: {} },
    firstName: { type: 'string', minLength: 3, maxLength: 50 },
    lastName: { type: 'string', minLength: 3, maxLength: 50 },
    email: { type: 'string', maxLength: 150, format: 'email' },
    username: { type: 'string', minLength: 3, maxLength: 50 },
    password: { type: 'string', format: 'password' }
  },
  required: ['adminUserId', 'email', 'password', 'adminRoleId']
})

export class CreateAdminUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const email = this.args.email
    const phone = this.args.phone
    const username = this.args.username
    const password = this.args.password
    const lastName = this.args.lastName
    const firstName = this.args.firstName
    const permission = this.args.permission
    const adminRoleId = this.args.adminRoleId
    const parentAdminId = this.args.parentAdminId || this.args.adminUserId
    const adminUserId = this.args.adminUserId

    const transaction = this.context.sequelizeTransaction
    try {
      if (parentAdminId !== adminUserId) {
        // It's important to treat parentAdminId as child admin id in this case,
        // please read the code and apply logic for clarification
        const isChild = await checkChild(adminUserId, parentAdminId, transaction)
        if (!isChild) return this.addError('ChildAdminUserNotFoundErrorType')
      }

      const existingAdmin = await this.context.sequelize.models.adminUser.findOne({ attributes: ['username', 'email'], where: { [Op.or]: [{ username }, { email }] }, transaction })
      if (existingAdmin) {
        if (existingAdmin.email === email) return this.addError('EmailAlreadyExistsErrorType')
        if (existingAdmin.username === username) return this.addError('UsernameAlreadyExistsErrorType')
      }

      const parentAdminUser = await this.context.sequelize.models.adminUser.findOne({
        attributes: ['id', 'adminRoleId'],
        where: { id: parentAdminId },
        include: {
          attributes: ['permission'],
          model: this.context.sequelize.models.permission
        },
        transaction
      })
      if (!parentAdminUser) return this.addError('ParentAdminNotFoundErrorType')
      if (parentAdminUser.adminRoleId === adminRoleId) return this.addError('ChildRoleCannotBeSameAsParentErrorType')

      const role = await this.context.sequelize.models.adminRole.findOne({ where: { id: adminRoleId }, transaction })
      if (!role) return this.addError('InvalidRoleIdErrorType')
      if (role.level === 1) return this.addError('SuperAdminRoleAssignmentErrorErrorType')

      const adminPayload = {
        email,
        emailVerified: true,
        adminRoleId: role.id,
        parentAdminId: parentAdminUser.id,
        password: await bcrypt.hash(password, appConfig.bcrypt.salt)
      }
      if (phone) adminPayload.phone = phone
      if (firstName) adminPayload.firstName = firstName
      if (lastName) adminPayload.lastName = lastName
      if (username) adminPayload.username = username

      const adminUser = await this.context.sequelize.models.adminUser.create(adminPayload, { transaction })

      const updatedPermissions = pickChildPermissiosFromParentPermissions(permission, parentAdminUser.permission.permission)
      await this.context.sequelize.models.permission.create({ permission: updatedPermissions, adminUserId: adminUser.id }, { transaction })

      logAdminActivity({
        adminUserId: parentAdminId,
        entityId: adminUser?.id,
        entityType: 'adminUser',
        action: 'create',
        changeTableId: adminUser?.id,
        changeTableName: 'admin_users',
        previousData: { adminUser: null },
        modifiedData: { adminUser: adminUser?.get({ plain: true }) },
        service: 'create admin user',
        category: tableCategoriesMapping.admin_users

      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
