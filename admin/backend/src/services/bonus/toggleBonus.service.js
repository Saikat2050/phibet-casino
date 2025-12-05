import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    bonusId: { type: 'number' }
  },
  required: ['bonusId', 'adminUserId']
})

export class ToggleBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const bonus = await this.context.sequelize.models.bonus.findOne({
        attributes: ['id', 'isActive', 'claimedCount'],
        where: { id: this.args.bonusId }
      })

      const previousData = { isActive: bonus.isActive }
      const modifiedData = { isActive: !bonus.isActive }

      if (!bonus) return this.addError('BonusDoesNotExistsErrorType')

      // if (bonus.claimedCount > 0) return this.addError('BonusUnderClaimExistsErrorType')

      bonus.isActive = !bonus.isActive
      await bonus.save()

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: bonus.id,
        entityType: 'bonus',
        action: 'update',
        changeTableId: bonus.id,
        changeTableName: 'bonus',
        previousData: previousData,
        modifiedData: modifiedData,
        service: 'toggleBonus',
        category: tableCategoriesMapping.bonus
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
