import { APIError } from '@src/errors/api.error'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'

export class GetSettingsService extends ServiceBase {
  async run () {
    try {
      const settings = await Cache.get(CACHE_KEYS.SETTINGS)
      return settings
    } catch (error) {
      throw new APIError(error)
    }
  }
}
