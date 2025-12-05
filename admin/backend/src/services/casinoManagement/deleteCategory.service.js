import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    categoryId: { type: 'string' }
  },
  required: ['categoryId']
})

export class DeleteCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction

    try {
      const category = await this.context.sequelize.models.casinoCategory.findOne({ where: { id: this.args.categoryId }, transaction })
      if (!category) return this.addError('CategoryNotFoundErrorType')

      const gameCount = await this.context.sequelize.models.casinoGame.count({ where: { casinoCategoryId: category.id }, transaction })
      if (gameCount) return this.addError('MoveAllTheGamesToAnotherCategoryErrorType')

      const previousData = category.get({ plain: true })
      await category.destroy({ transaction })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: category.id,
        entityType: 'casinoCategory',
        action: 'delete',
        changeTableId: category.id,
        changeTableName: 'casino_categories',
        previousData: { category: previousData },
        modifiedData: { category: null },
        service: 'deleteCategory',
        category: tableCategoriesMapping.casino_categories
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
