import { APIError } from '@src/errors/api.error'
import { populateSettingsCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    currency: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string', enum: ['GC', 'BSC'] },
          coins: { type: 'number' }
        },
        additionalProperties: false,
        required: ['code', 'coins']
      }
    },
    status: { type: 'boolean' },
    limit: { type: 'number', minimum: 1, default: 1 }
  },
  required: ['adminUserId']
})

export class ReferralUpdateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const currency = this.args.currency
    const status = this.args.status
    const limit = this.args.limit

    try {
      const transaction = this.context.sequelizeTransaction

      const referral = await this.context.sequelize.models.setting.findOne({
        where: { key: SETTING_KEYS.REFERRAL }
      })
      if (!referral) return this.addError('ReferralNotExistErrorType')

      const referralData = JSON.parse(referral.value)
      const previousData = JSON.parse(referral.value)

      if (currency) referralData.currency = currency
      if (status != null) referralData.isActive = status
      if (limit) referralData.limit = limit
      referral.value = JSON.stringify(referralData)

      await this.context.sequelize.models.setting.update({ value: referral.value }, { where: { key: SETTING_KEYS.REFERRAL }, transaction })
      await populateSettingsCache(this.context)

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: referral.id,
        entityType: 'setting',
        action: 'update',
        changeTableId: referral.id,
        changeTableName: 'settings',
        previousData: { referralSettings: previousData },
        modifiedData: { referralSettings: JSON.parse(referral.value) },
        service: 'referralUpdate',
        category: tableCategoriesMapping.settings
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
