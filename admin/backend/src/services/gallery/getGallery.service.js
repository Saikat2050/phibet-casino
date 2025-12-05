import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import { GetSettingsService } from '@src/services/setting/getSettings.service'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'

export class GetGalleryService extends ServiceBase {
  async run () {
    try {
      const { result: settings } = await GetSettingsService.execute({ keys: [SETTING_KEYS.GALLERY] }, this.context)
      return { gallery: settings[SETTING_KEYS.GALLERY] }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
