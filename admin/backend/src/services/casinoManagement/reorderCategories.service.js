import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    categoryIds: { type: 'array' },
    adminUserId: { type: 'string' }
  },
  required: ['categoryIds', 'adminUserId']
})

export class ReorderCategoriesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const categoryIds = [...(new Set(this.args.categoryIds))]
    const transaction = this.context.sequelizeTransaction

    try {
      const previousOrderIds = await this.context.sequelize.models.casinoCategory.findAll({
        where: { id: categoryIds },
        attributes: ['id', 'orderId'],
        raw: true
      })

      const previousOrderIdsMap = previousOrderIds.reduce((acc, currCategory) => {
        acc[currCategory.id] = currCategory.orderId
        return acc
      }, {})

      const previousData = categoryIds.map(categoryId => ({
        id: categoryId,
        orderId: previousOrderIdsMap[categoryId] || null
      }))

      await Promise.all(categoryIds.map(async (categoryId, index) => {
        await this.context.sequelize.models.casinoCategory.update({ orderId: index + 1 }, { where: { id: categoryId }, transaction })
      }))

      const modifiedData = categoryIds.map((categoryId, index) => ({
        id: categoryId,
        orderId: index + 1
      }))

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        // entityId: categoryIds.join(','),
        entityType: 'casinoCategories',
        action: 'update',
        // changeTableId: categoryIds.join(','),
        changeTableName: 'casino_categories',
        previousData: { categories: previousData },
        modifiedData: { categories: modifiedData },
        service: 'reorderCategories',
        moreDetails: { categoryIds: categoryIds.join(',') },
        category: tableCategoriesMapping.casino_categories
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
