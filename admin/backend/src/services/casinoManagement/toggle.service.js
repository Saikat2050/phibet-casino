import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { CASINO_ENTITY_TYPES } from '@src/utils/constants/casinoManagement.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const CASINO_ENTITY_TO_ERROR_MESSAGES_MAP = {
  [CASINO_ENTITY_TYPES.GAME]: 'GameNotFoundErrorType',
  [CASINO_ENTITY_TYPES.CATEGORY]: 'CategoryNotFoundErrorType',
  [CASINO_ENTITY_TYPES.PROVIDER]: 'ProviderNotFoundErrorType',
  [CASINO_ENTITY_TYPES.AGGREGATOR]: 'AggregatorNotFoundErrorType',
  [CASINO_ENTITY_TYPES.SUB_CATEGORY]: 'SubCategoryNotFoundErrorType'
}

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    id: { type: 'string' },
    type: { enum: Object.values(CASINO_ENTITY_TYPES) }
  },
  required: ['id', 'type']
})

export class ToggleService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const type = this.args.type

    const modelMap = {
      [CASINO_ENTITY_TYPES.GAME]: this.context.sequelize.models.casinoGame,
      [CASINO_ENTITY_TYPES.CATEGORY]: this.context.sequelize.models.casinoCategory,
      [CASINO_ENTITY_TYPES.PROVIDER]: this.context.sequelize.models.casinoProvider,
      [CASINO_ENTITY_TYPES.AGGREGATOR]: this.context.sequelize.models.casinoAggregator
    }

    try {
      const model = modelMap[type]
      const entity = await model.findOne({ where: { id: this.args.id } })
      if (!entity) return this.addError(CASINO_ENTITY_TO_ERROR_MESSAGES_MAP[type])

      const previousData = entity.isActive

      entity.isActive = !entity.isActive
      await entity.save()

      const modifiedData = entity.isActive

      const respectiveEntityType = {
        game: 'casinoProvider',
        category: 'casinoCategory',
        provider: 'casinoAggregator',
        aggregator: 'casinoAggregator'
        // SUB_CATEGORY: ''
      }

      const respectiveEntityId = {
        game: entity.casinoProviderId,
        category: entity.id,
        provider: entity.casinoAggregatorId,
        aggregator: entity.id
        // SUB_CATEGORY: ''
      }

      const respectiveChangeTableName = {
        game: 'casino_games',
        category: 'casino_categories',
        provider: 'casino_providers',
        aggregator: 'casino_aggregators'
        // SUB_CATEGORY: ''
      }

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: respectiveEntityId[type],
        entityType: respectiveEntityType[type],
        action: 'update',
        changeTableId: entity?.id,
        changeTableName: respectiveChangeTableName[type],
        previousData: { isActive: previousData },
        modifiedData: { isActive: modifiedData },
        service: 'toggle',
        category: tableCategoriesMapping[respectiveChangeTableName[type]]
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
