import ServiceBase from '@src/libs/serviceBase'
import { DEFAULT_CHAT_THEME } from '@src/utils/constants/chat.constants'
/**
 * Provides service for chat settings and chatConfig
 * @export
 * @class GetDefaultChatSettingsService
 * @extends {ServiceBase}
 */

export class GetChatThemeService extends ServiceBase {
  async run () {
    try {

      const SiteSettingModel = this.context.sequelize.models.setting

      const settings = await SiteSettingModel.findOne({
        where: { key: 'defaultChatTheme' },
        attributes: ['value']
      })
      if(!settings) return DEFAULT_CHAT_THEME
      return { theme: JSON.parse(settings.value) }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
