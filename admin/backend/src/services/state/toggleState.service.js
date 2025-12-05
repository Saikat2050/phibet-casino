import { APIError } from '@src/errors/api.error'
import { populateStatesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    stateId: { type: 'string' }
  },
  required: ['stateId']
})

export class ToggleStateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { stateId } = this.args

    try {
      const state = await this.context.sequelize.models.state.findOne({ where: { id: stateId }, transaction })
      if (!state) return this.addError('StateNotFoundErrorType')

      const previousData = { name: state?.name, isActive: state?.isActive }
      state.isActive = !state.isActive
      await state.save({ transaction })

      await populateStatesCache(transaction)

      const modifiedData = { name: state?.name, isActive: state?.isActive }

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: state?.id,
        entityType: 'state',
        action: 'update',
        changeTableId: state?.id,
        changeTableName: 'states',
        previousData: { state: previousData },
        modifiedData: { state: modifiedData },
        service: 'toggle state',
        category: tableCategoriesMapping.states
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
