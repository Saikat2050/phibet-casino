import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    wheelDivisionId: { type: 'string' },
    sc: { type: 'number', minimum: 0 },
    gc: { type: 'number', minimum: 0 },
    isAllow: { type: 'boolean' },
    playerLimit: { type: ['integer', 'null'] },
    priority: { type: 'integer' }
  },
  required: ['wheelDivisionId']
})

export class UpdateSpinWheelService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { wheelDivisionId, sc, gc, priority, isAllow, playerLimit } = this.args

    const checkWheelConfigExists = await this.context.sequelize.models.wheelDivisionConfiguration.findOne({
      where: { wheelDivisionId },
      transaction: this.context.sequelizeTransaction
    })

    if (!checkWheelConfigExists) return this.addError('NotFoundErrorType')

    const previousData = { wheelDivisionId, sc: checkWheelConfigExists?.sc, gc: checkWheelConfigExists?.gc, priority: checkWheelConfigExists?.priority, playerLimit: checkWheelConfigExists?.playerLimit, isAllow: checkWheelConfigExists?.isAllow }

    const modifiedData = {
      wheelDivisionId,
      sc: sc ?? checkWheelConfigExists?.sc,
      gc: gc ?? checkWheelConfigExists?.gc,
      priority: priority ?? checkWheelConfigExists?.priority,
      playerLimit: playerLimit ?? checkWheelConfigExists?.playerLimit,
      isAllow: isAllow != null ? isAllow : checkWheelConfigExists?.isAllow
    }

    if (Number(wheelDivisionId) === 1) {
      await this.context.sequelize.models.wheelDivisionConfiguration.update({ sc, gc, priority },
        {
          where: { wheelDivisionId },
          data: { sc, gc, priority },
          transaction: this.context.sequelizeTransaction
        })
    } else {
      if (playerLimit === '') playerLimit = null
      await this.context.sequelize.models.wheelDivisionConfiguration.update(
        { wheelDivisionId, sc, gc, isAllow, playerLimit, priority },
        {
          where: { wheelDivisionId },
          transaction: this.context.sequelizeTransaction
        })
    }
    logAdminActivity({
      adminUserId: this.args.adminUserId,
      entityId: wheelDivisionId,
      entityType: 'wheelDivisionConfiguration',
      action: 'update',
      changeTableId: wheelDivisionId,
      changeTableName: 'wheel_division_configurations',
      previousData: { spinWheelDivision: previousData },
      modifiedData: { spinWheelDivision: modifiedData },
      service: 'update wheel division',
      category: tableCategoriesMapping.wheel_devision_configurations
    })

    return { wheelDivisionId: wheelDivisionId }
  }
}
