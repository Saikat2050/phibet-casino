import ServiceBase from '@src/libs/serviceBase'
import { SITE_SETTINGS_KEY_TYPES } from '@src/utils/constants/app.constants.js'
import { Op } from 'sequelize'
/**
 * Provides service for chat settings and chatConfig
 * @export
 * @class GetDefaultChatSettingsService
 * @extends {ServiceBase}
 */
export class GetDefaultChatSettingsService extends ServiceBase {
  async run () {
    try {
      const SiteSettingModel = this.context.sequelize.models.setting
      const settings = await SiteSettingModel.findAll({
        where: { key: { [Op.in]: [SITE_SETTINGS_KEY_TYPES.DEFAULT_CHAT_SETTINGS, SITE_SETTINGS_KEY_TYPES.CHAT_CONFIGURATION] } }
      })

      return settings
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
