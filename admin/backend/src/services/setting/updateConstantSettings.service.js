import { APIError } from '@src/errors/api.error'
import { populateSettingsCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'
import { SETTING_DATA_TYPES } from '@src/utils/constants/public.constants.utils'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    applicationName: { type: 'string' },
    userEndUrl: { type: 'string', format: 'uri' },
    adminEndUrl: { type: 'string', format: 'uri' },
    defaultSupport: { type: 'string', format: 'email' },
    legalSupport: { type: 'string', format: 'email' },
    partnersSupport: { type: 'string', format: 'email' },
    xpRequirements: { type: 'number' },
    footerLandingPage: { type: 'string' },
    footerLobbyPage: { type: 'string' },
    purchaseCooldown: { type: 'number' }
  }
})

export class UpdateConstantSettingsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userEndUrl = this.args.userEndUrl
    const adminEndUrl = this.args.adminEndUrl
    const defaultSupport = this.args.defaultSupport
    const applicationName = this.args.applicationName
    const xpRequirements = this.args.xpRequirements
    const legalSupport = this.args.legalSupport
    const partnersSupport = this.args.partnersSupport
    const footerLandingPage = this.args.footerLandingPage
    const footerLobbyPage = this.args.footerLobbyPage
    const transaction = this.context.sequelizeTransaction
    const purchaseCooldown = this.args.purchaseCooldown

    try {
      const updatedSettings = []

      // finding existing data
      const settingsMap = {
        [SETTING_KEYS.USER_END_URL]: userEndUrl,
        [SETTING_KEYS.ADMIN_END_URL]: adminEndUrl,
        [SETTING_KEYS.DEFAULT_SUPPORT]: defaultSupport,
        [SETTING_KEYS.APPLICATION_NAME]: applicationName,
        [SETTING_KEYS.XP_REQUIREMENTS]: xpRequirements
      }
      const settingKeys = Object.keys(settingsMap).filter(key => settingsMap[key])
      const exitingData = await this.context.sequelize.models.setting.findAll({
        attributes: ['key', 'value', 'id'],
        where: { key: settingKeys },
        transaction,
        raw: true
      })

      if (userEndUrl) updatedSettings.push({ key: SETTING_KEYS.USER_END_URL, value: userEndUrl, dataType: SETTING_DATA_TYPES.STRING })
      if (adminEndUrl) updatedSettings.push({ key: SETTING_KEYS.ADMIN_END_URL, value: adminEndUrl, dataType: SETTING_DATA_TYPES.STRING })
      if (defaultSupport) updatedSettings.push({ key: SETTING_KEYS.DEFAULT_SUPPORT, value: defaultSupport, dataType: SETTING_DATA_TYPES.STRING })
      if (applicationName) updatedSettings.push({ key: SETTING_KEYS.APPLICATION_NAME, value: applicationName, dataType: SETTING_DATA_TYPES.STRING })
      if (xpRequirements) updatedSettings.push({ key: SETTING_KEYS.XP_REQUIREMENTS, value: xpRequirements, dataType: SETTING_DATA_TYPES.NUMBER })
      if (legalSupport) updatedSettings.push({ key: SETTING_KEYS.LEGAL_SUPPORT, value: legalSupport, dataType: SETTING_DATA_TYPES.STRING })
      if (partnersSupport) updatedSettings.push({ key: SETTING_KEYS.PARTNER_SUPPORT, value: partnersSupport, dataType: SETTING_DATA_TYPES.STRING })
      if (footerLandingPage) updatedSettings.push({ key: SETTING_KEYS.FOOTER_LANDING_PAGE, value: footerLandingPage, dataType: SETTING_DATA_TYPES.STRING })
      if (footerLobbyPage) updatedSettings.push({ key: SETTING_KEYS.FOOTER_LOBBY_PAGE, value: footerLobbyPage, dataType: SETTING_DATA_TYPES.STRING })
      if (purchaseCooldown) updatedSettings.push({ key: SETTING_KEYS.PURCHASE_COOLDOWN, value: purchaseCooldown, dataType: SETTING_DATA_TYPES.NUMBER })

      await this.context.sequelize.models.setting.bulkCreate(updatedSettings, {
        updateOnDuplicate: ['value'],
        transaction
      })

      const settingIdsArray = exitingData?.map(({ id }) => id)
      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: settingIdsArray?.length === 1 ? settingIdsArray[0] : null,
        entityType: 'setting',
        action: 'update',
        changeTableId: settingIdsArray?.length === 1 ? settingIdsArray[0] : null,
        changeTableName: 'settings',
        previousData: { setting: exitingData?.map(({ key, value }) => ({ key, value })) },
        modifiedData: { setting: updatedSettings?.map(({ key, value }) => ({ key, value })) },
        service: 'update constant setting',
        category: tableCategoriesMapping.settings,
        moreDetails: settingIdsArray?.length === 1 ? null : { settingIds: settingIdsArray.join(',') }
      })

      await populateSettingsCache(this.context)
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
