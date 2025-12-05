import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    providerIds: { type: 'array' }
  },
  required: ['providerIds']
})

export class ReorderProviderService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const providersIds = [...(new Set(this.args.providerIds))]
    const transaction = this.context.sequelizeTransaction

    try {
      const previousOrderIds = await this.context.sequelize.models.casinoProvider.findAll({
        where: { id: providersIds },
        attributes: ['id', 'orderId'],
        raw: true
      })
      const previousOrderIdsMap = previousOrderIds.reduce((acc, currProvider) => {
        acc[currProvider.id] = currProvider.orderId
        return acc
      }, {})
      const previousData = providersIds.map(providerId => ({
        id: providerId,
        orderId: previousOrderIdsMap[providerId] || null
      }))

      await Promise.all(providersIds.map(async (providersId, index) => {
        await this.context.sequelize.models.casinoProvider.update({ orderId: index + 1 }, { where: { id: providersId }, transaction })
      }))

      const modifiedData = providersIds.map((providerId, index) => ({
        id: providerId,
        orderId: index + 1
      }))

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        // entityId: providerIds.join(','),
        entityType: 'casinoAggregator',
        action: 'update',
        // changeTableId: providerIds.join(','),
        changeTableName: 'casino_providers',
        previousData: { providerOrderId: previousData },
        modifiedData: { providerOrderId: modifiedData },
        service: 'reorderProvider',
        category: tableCategoriesMapping.casino_providers,
        moreDetails: { providerIds: providersIds.join(',') }
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
