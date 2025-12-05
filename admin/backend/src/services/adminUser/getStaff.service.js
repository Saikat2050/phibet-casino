import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { GetAdminHierarchyService } from '@src/services/adminUser/getAdminHierarchy.service'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    searchString: { type: 'string' },
    parentAdminId: { type: 'string' },
    isActive: { type: 'boolean' },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['id', 'name', 'role', 'status', 'email','createdAt'], default: 'createdAt' },
    page: { type: 'number', default: 1, minimum: 1 },
    perPage: { type: 'number', default: 10, minimum: 1, maximum: 100 }
  },
  required: ['parentAdminId', 'page', 'perPage']
})

export class GetStaffService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage

    try {
      const { result: staff, errors } = (await GetAdminHierarchyService.execute({
        perPage,
        associations: true,
        page: this.args.page,
        order: this.args.order,
        orderBy: this.args.orderBy,
        isActive: this.args.isActive,
        adminUserId: this.args.parentAdminId,
        searchString: this.args.searchString
      }, this.context))
      if (_.size(errors)) return this.errors

      return { staff: staff.rows, page, totalPages: Math.ceil(staff.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
