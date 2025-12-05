import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    seoPageId: { type: 'string' }
  },
  required: ['seoPageId']
})

export class GetSeoPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const seoPage = await this.context.sequelize.models.seoPages.findOne({
        where: { id: this.args.seoPageId },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      })
      if (!seoPage) return this.addError('SeoPageNotFoundErrorType')

      return { seoPage }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
