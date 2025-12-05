import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import _ from 'lodash'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    providerId: { type: 'string' },
    stateCodes: { type: 'array' }
  },
  required: ['providerId', 'stateCodes']
})

export class ProviderRemoveRestrictedStatesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { stateCodes, providerId } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const provider = await this.context.sequelize.models.casinoProvider.findOne({ where: { id: providerId }, transaction })
      if (!provider) return this.addError('ProviderNotFoundErrorType')

      const states = await this.context.sequelize.models.state.findOne({
        attributes: [[Sequelize.fn('ARRAY_AGG', Sequelize.col('id')), 'stateIds']],
        where: { code: { [Op.in]: stateCodes } },
        raw: true,
        transaction
      })
      const previousData = provider.restrictedStates
      provider.restrictedStates = _.difference(provider.restrictedStates, states.stateIds)
      const modifiedData = provider.restrictedStates
      
      await provider.save({ transaction })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: provider.casinoAggregatorId,
        entityType: 'casinoAggregator',
        action: 'update',
        changeTableId: provider.id,
        changeTableName: 'casino_providers',
        previousData: { restrictedStates: previousData },
        modifiedData: { restrictedStates: modifiedData },
        service: 'providerRemoveRestrictedStates',
        category: tableCategoriesMapping.casino_providers
      })

      return { provider }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
