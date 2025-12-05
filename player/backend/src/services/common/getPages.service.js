import { APIError } from '@src/errors/api.error'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'

export class GetPagesService extends ServiceBase {
  async run () {
    try {
      const { id } = this.args;
      const pages = await Cache.get(CACHE_KEYS.PAGES)
      if (id) {
        return { pages: pages?.filter((cms) => cms?.id?.toString() === id?.toString()) }
      } else return { pages }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
