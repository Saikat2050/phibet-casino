import { APIError } from '@src/errors/api.error'
import { populateAllVipLevelDetails, populateVipLevelDetails } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    level: { type: 'number' },
    name: { type: 'string' },
    xpRequirement: { type: 'number' },
    tierUpBonus: { type: 'object' },
    monthlyPercentage: { type: 'number' },
    weeklyPercentage: { type: 'number' },
    rakebackPercentage: { type: ['number', 'null'] },
    issueSpinWheel: { type: ['number', 'null'] },
    isActive: { type: 'boolean' }
  },
  required: ['name', 'level', 'xpRequirement', 'monthlyPercentage', 'weeklyPercentage', 'isActive']
})

export class CreateVipTiers extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const {
        level,
        name,
        xpRequirement,
        tierUpBonus,
        monthlyPercentage,
        weeklyPercentage,
        rakebackPercentage,
        issueSpinWheel,
        isActive
      } = this.args
      const transaction = this.context.sequelizeTransaction

      const existingVipTier = await this.context.models.vipTier.findOne({ where: { [Op.or]: [{ name }, { level }] } })
      if (existingVipTier) {
        if (existingVipTier.name === name) return this.addError('VipTierNameExistsErrorType')
        if (existingVipTier.level === level) return this.addError('VipTierLevelExistsErrorType')
      }

      const existingMaxXpRequirement = await this.context.models.vipTier.max('xpRequirement')
      if (+existingMaxXpRequirement >= +xpRequirement) return this.addError('VipTierXpRequirementErrorType')

      const createdVipTier = await this.context.models.vipTier.create({
        name,
        level,
        xpRequirement,
        tierUpBonus,
        monthlyPercentage,
        weeklyPercentage,
        rakebackPercentage,
        issueSpinWheel,
        isActive
      }, { transaction })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: createdVipTier?.id,
        entityType: 'vipTier',
        action: 'create',
        changeTableId: createdVipTier?.id,
        changeTableName: 'vip_tiers',
        previousData: { vipTier: null },
        modifiedData: { vipTier: createdVipTier?.get({ plain: true }) },
        service: 'create vip tiers'
      })

      await populateVipLevelDetails(this.context)
      await populateAllVipLevelDetails(this.context)

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
