import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    keys: {
      type: 'array',
      items: {
        enum: Object.values(SETTING_KEYS)
      }
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
      const where = {}
      if (keys) {
        where[Op.or] = keys.map(key => {
          return { key }
        })
      }

      const settings = await this.context.sequelize.models.setting.findAll({ where, raw: true })
      return settings.reduce((prev, setting) => {
        prev[setting.key] = setting
        return prev
      }, {})
    } catch (error) {
      throw new APIError(error)
    }
  }
}
