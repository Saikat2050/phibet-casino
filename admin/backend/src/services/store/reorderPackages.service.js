import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    packageIds: { type: 'array' }
  },
  required: ['packageIds']
})

export class ReorderPackagesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const packageIds = [...(new Set(this.args.packageIds))]
    const transaction = this.context.sequelizeTransaction

    try {
      const previousOrders = await this.context.sequelize.models.package.findAll({
        where: { id: packageIds },
        attributes: ['id', 'orderId'],
        raw: true
      })
      const previousOrderMap = previousOrders.reduce((acc, pkg) => {
        acc[pkg.id] = pkg.orderId
        return acc
      }, {})
      const previousData = packageIds.map(packageId => ({
        id: packageId,
        orderId: previousOrderMap[packageId] || null
      }))

      await Promise.all(packageIds.map(async (packageId, index) => {
        await this.context.sequelize.models.package.update({ orderId: index + 1 }, { where: { id: packageId }, transaction })
      }))

      const modifiedData = packageIds.map((packageId, index) => ({
        id: packageId,
        orderId: index + 1
      }))

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        // entityId: packageIds.join(','),
        entityType: 'package',
        action: 'update',
        // changeTableId: packageIds.join(','),
        changeTableName: 'packages',
        previousData: { packages: previousData },
        modifiedData: { packages: modifiedData },
        service: 'update package order',
        category: tableCategoriesMapping.packages,
        moreDetails: { packageIds: packageIds.join(',') }
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
