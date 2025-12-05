import { APIError } from '@src/errors/api.error'
import { populateAllVipLevelDetails, populateVipLevelDetails } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import { ServiceBase } from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { Op } from 'sequelize'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'number' },
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
  required: ['id', 'name', 'level', 'xpRequirement', 'monthlyPercentage', 'weeklyPercentage', 'isActive']
})

export class UpdateVipTiers extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      let {
        id, level, name, xpRequirement, tierUpBonus, monthlyPercentage, weeklyPercentage, rakebackPercentage,
        issueSpinWheel, isActive
      } = this.args

      const transaction = this.context.sequelizeTransaction

      const vipTier = await this.context.sequelize.models.vipTier.findOne({ where: { id }, transaction })
      if (!vipTier) return this.addError('VipTierDoesNotExistsErrorType')

      const where = {
        id: { [Op.ne]: id },
        [Op.or]: [
          { name: name },
          { level: level },
          { xpRequirement: xpRequirement }
        ]
      }
      const isXpNameLevelPresentAlready = await this.context.sequelize.models.vipTier.findOne({ where })

      if (isXpNameLevelPresentAlready) {
        if (isXpNameLevelPresentAlready.name === name) return this.addError('VipTierNameExistsErrorType')
        if (isXpNameLevelPresentAlready.level === level) return this.addError('VipTierLevelExistsErrorType')
        // if (isXpNameLevelPresentAlready.xpRequirement === xpRequirement) return this.addError('VipTierXpRequirementExistsErrorType')
      }

      if (isActive === false && level === 0) return this.addError('VipTierZeroLevelErrorType')
      if (xpRequirement && level === 0) xpRequirement = 0

      if (xpRequirement) {
        const vipTiers = await Cache.get(CACHE_KEYS.ALL_VIP_TIERS)
        const higherLevels = vipTiers.filter(obj => obj.level > level)
        const isValid = higherLevels.every(obj => obj.xpRequirement > xpRequirement)
        if (!isValid) return this.addError('VipTierXpRequirementExistsErrorType')
      }

      const trackingFields = [
        'name', 'level', 'xpRequirement', 'icon', 'tierUpBonus', 'monthlyPercentage', 'weeklyPercentage', 'rakebackPercentage', 'issueSpinWheel', 'isActive'
      ]
      const previousData = Object.fromEntries(trackingFields.map(key => [key, vipTier[key]]))

      vipTier.name = name ?? vipTier.name
      vipTier.level = level ?? vipTier.level
      vipTier.xpRequirement = xpRequirement ?? vipTier.xpRequirement
      vipTier.tierUpBonus = tierUpBonus ?? vipTier.tierUpBonus
      vipTier.monthlyPercentage = monthlyPercentage ?? vipTier.monthlyPercentage
      vipTier.weeklyPercentage = weeklyPercentage ?? vipTier.weeklyPercentage
      vipTier.rakebackPercentage = rakebackPercentage ?? vipTier.rakebackPercentage
      vipTier.issueSpinWheel = issueSpinWheel ?? vipTier.issueSpinWheel
      vipTier.isActive = isActive

      await vipTier.save({ transaction })
      await this.context.sequelize.models.vipTier.update({ ...vipTier }, { where, transaction })

      await populateVipLevelDetails(this.context)
      await populateAllVipLevelDetails(this.context)

      const modifiedData = Object.fromEntries(trackingFields.map(key => [key, vipTier[key]]))
      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: vipTier.id,
        entityType: 'vipTier',
        action: 'update',
        changeTableId: vipTier.id,
        changeTableName: 'vip_tiers',
        previousData: { vipTier: previousData },
        modifiedData: { vipTier: modifiedData },
        service: 'update vip tiers',
        category: tableCategoriesMapping.vip_tiers
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
