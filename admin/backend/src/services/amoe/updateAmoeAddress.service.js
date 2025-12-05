import { APIError } from '@src/errors/api.error'
import { populateSettingsCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    addressLine1: { type: 'string' },
    addressLine2: { type: 'string' },
    city: { type: 'string' },
    state: { type: 'string' },
    postalCode: { type: 'string' },
    country: { type: 'string' },
    email: { type: 'string' },
    adminUserId: { type: 'string' }
  },
  required: ['adminUserId']
})

export class UpdateAmoeAddressService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { addressLine1, addressLine2, city, state, postalCode, country, email } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const settings = await this.context.sequelize.models.setting.findOne({ where: { key: SETTING_KEYS.AMOE_ADDRESS }, transaction })
      const value = JSON.parse(settings.value)
      const previousData = settings?.value
      if (addressLine1) value.addressLine1 = addressLine1
      if (addressLine2) value.addressLine2 = addressLine2
      if (city) value.city = city
      if (postalCode) value.postalCode = postalCode
      if (state) value.state = state
      if (country) value.country = country
      if (email) value.email = email
      settings.value = JSON.stringify(value)
      const modifiedData = settings?.value
      await this.context.sequelize.models.setting.update({ value: settings.value }, { where: { key: SETTING_KEYS.AMOE_ADDRESS }, transaction })
      await populateSettingsCache(this.context)

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: settings.id,
        entityType: 'setting',
        action: 'update',
        changeTableId: settings.id,
        changeTableName: 'settings',
        previousData: { amoeAddress: previousData },
        modifiedData: { amoeAddress: modifiedData },
        service: 'update amoe address',
        category: tableCategoriesMapping.settings
      })

      return JSON.parse(settings.value)
    } catch (error) {
      throw new APIError(error)
    }
  }
}
