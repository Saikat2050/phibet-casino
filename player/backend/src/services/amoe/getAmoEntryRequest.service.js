import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    page: { type: 'string', default: 1 },
    perPage: { type: 'string', default: 10 }
  },
  required: ['userId']
})

export class GetAmoEntryRequestService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const userId = this.args.userId
      const perPage = this.args.perPage
      const page = this.args.page
      const settings = await Cache.get(CACHE_KEYS.SETTINGS)
      const amoEntries = await this.context.sequelize.models.amoEntry.findAndCountAll({
        where: { userId },
        limit: perPage,
        order: [['createdAt', 'DESC']],
        offset: (page - 1) * perPage
      })

      return { mailingAddress: settings.amoEntryAddress, amoEntries: amoEntries.rows, page, totalPages: Math.ceil(amoEntries.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
