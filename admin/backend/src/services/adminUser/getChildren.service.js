import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { GetAdminHierarchyService } from './getAdminHierarchy.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    parentAdminId: { type: 'string' }
  },
  required: ['parentAdminId']
})

export class GetChildrenService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const adminUser = await this.context.sequelize.models.adminUser.findOne({ attributes: ['id'], where: { id: this.args.parentAdminId } })
      if (!adminUser) return this.addError('UserDoesNotExistsErrorType')

      const adminsHierarchy = (await GetAdminHierarchyService.execute({ adminUserId: adminUser.id }, this.context)).result.rows
      adminsHierarchy.forEach(admin => {
        const parentAdmin = adminsHierarchy.find(parent => parent.id === admin.parentAdminId)
        if (parentAdmin) {
          parentAdmin.children = parentAdmin.children || []
          parentAdmin.children.push(admin)
        }
      })

      // Step 2: Filter only top-level admins
      const hierarchyTree = adminsHierarchy.filter(admin => !admin.parentAdminId)

      return { admin: hierarchyTree?.[0] || {} }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
