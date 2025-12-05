import { APIError } from '@src/errors/api.error'
import { populateSettingsCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { GetSettingsService } from '@src/services/setting/getSettings.service'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'
import { SETTING_DATA_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    minOdds: { type: 'number', minimum: 1.01 },
    maxOdds: { type: 'number', minimum: 1.01 },
    minStakeAmount: { type: 'number', minimum: 1 },
    exchangeBetCommission: { type: 'number', minimum: 1.5 }
  }
})

export class UpdateValueComparisonSettingsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const minOdds = this.args.minOdds
    const maxOdds = this.args.maxOdds
    const minStakeAmount = this.args.minStakeAmount
    const exchangeBetCommission = this.args.exchangeBetCommission

    try {
      const updatedSettings = []
      const settings = await GetSettingsService.run({}, this.context)

      if (minOdds && maxOdds) {
        if (minOdds > maxOdds) return this.addError('MaxOddsShouldBeGreaterThenMinOddsErrorType')
        updatedSettings.push({ key: SETTING_KEYS.MIN_ODDS, value: minOdds, dataType: SETTING_DATA_TYPES.NUMBER }, { key: SETTING_KEYS.MAX_ODDS, value: maxOdds, dataType: SETTING_DATA_TYPES.NUMBER })
      } else if (minOdds) {
        if (minOdds > settings[SETTING_KEYS.MAX_ODDS]) return this.addError('MaxOddsShouldBeGreaterThenMinOddsErrorType')
        updatedSettings.push({ key: SETTING_KEYS.MIN_ODDS, value: minOdds, dataType: SETTING_DATA_TYPES.NUMBER })
      } else if (maxOdds) {
        if (maxOdds < settings[SETTING_KEYS.MIN_ODDS]) return this.addError('MaxOddsShouldBeGreaterThenMinOddsErrorType')
        updatedSettings.push({ key: SETTING_KEYS.MAX_ODDS, value: maxOdds, dataType: SETTING_DATA_TYPES.NUMBER })
      }

      if (minStakeAmount) updatedSettings.push({ key: SETTING_KEYS.MIN_STAKE_AMOUNT, value: minStakeAmount, dataType: SETTING_DATA_TYPES.NUMBER })
      if (exchangeBetCommission) updatedSettings.push({ key: SETTING_KEYS.EXCHANGE_BET_COMMISSION, value: exchangeBetCommission, dataType: SETTING_DATA_TYPES.PERCENTAGE })

      await this.context.sequelize.models.setting.bulkCreate(updatedSettings, {
        updateOnDuplicate: ['value']
      })

      await populateSettingsCache()
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
