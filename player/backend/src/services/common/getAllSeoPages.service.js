import { APIError } from '@src/errors/api.error'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'

export class GetSeoPagesService extends ServiceBase {
  async run () {
    try {
      const seoPages = await Cache.get(CACHE_KEYS.SEO_PAGES)
      return { seoPages }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
