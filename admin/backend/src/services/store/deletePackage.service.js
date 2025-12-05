import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    id: { type: 'integer' }
  },
  required: ['id']
})

export class DeletePackageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { id } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      // Find the package to delete
      const packageToDelete = await this.context.sequelize.models.package.findByPk(id, { transaction })
      if (!packageToDelete) return this.addError('PackageNotFoundErrorType')

      if (packageToDelete.welcomePackage) await Cache.del(CACHE_KEYS.WELCOME_PACKAGE)

      // Delete the package
      await packageToDelete.destroy({ transaction })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: id,
        entityType: 'package',
        action: 'delete',
        changeTableId: id,
        changeTableName: 'packages',
        previousData: { package: packageToDelete },
        modifiedData: { package: null },
        service: 'delete package',
        category: tableCategoriesMapping.packages

      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
