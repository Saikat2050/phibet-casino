import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const schema = {
  type: 'object',
  properties: {
    bonusId: { type: 'number' },
    adminUserId: { type: 'string' }
  },
  required: ['bonusId', 'adminUserId']
}

const constraints = ajv.compile(schema)

export class DeleteBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { bonusId } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const bonus = await this.context.sequelize.models.bonus.findOne({
        where: { id: bonusId },
        attributes: ['id', 'bonusType', 'claimedCount'],
        transaction
      })

      if (!bonus) return this.addError('BonusDoesNotExistsErrorType')
      if (bonus.claimedCount > 0) return this.addError('BonusUnderClaimExistsErrorType')

      await bonus.destroy({ transaction })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: bonus.id,
        entityType: 'bonus',
        action: 'delete',
        changeTableId: bonus.id,
        changeTableName: 'bonus',
        previousData: { bonus: bonus.get({ plain: true }) },
        modifiedData: { bonus: null },
        service: 'deleteBonus',
        category: tableCategoriesMapping.bonus
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
