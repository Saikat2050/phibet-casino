import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    pageId: { type: 'string' }
  },
  required: ['pageId']
})

export class GetPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const page = await this.context.sequelize.models.page.findOne({ where: { id: this.args.pageId } })
      if (!page) return this.addError('PageNotFoundErrorType')

      return { page }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
