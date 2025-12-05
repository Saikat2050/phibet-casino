import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import { ServiceBase } from '@src/libs/serviceBase'
import { CACHE_KEYS, SETTING_KEYS } from '@src/utils/constants/app.constants'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    keys: {
      type: 'array',
      items: {
        enum: Object.values(SETTING_KEYS)
      },
      default: []
    }
  }
})

export class GetSettingsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Array} */
    const keys = this.args.keys

    try {
      const settings = await Cache.get(CACHE_KEYS.SETTINGS)
      return keys.length ? _.pick(settings, keys) : settings
    } catch (error) {
      throw new APIError(error)
    }
  }
}
