import { APIError } from '@src/errors/api.error'
import { populateSeoPagesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    slug: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    noIndex: { type: 'boolean', default: false },
    canonicalUrl: { type: 'string' },
    isActive: { type: 'boolean', default: true }
  },
  required: ['slug', 'title', 'description', 'noIndex']
})

export class CreateSeoPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { slug, title, description, noIndex, isActive, canonicalUrl } = this.args
    const transaction = this.context.sequelizeTransaction
    const {
      seoPages: seoPagesModel
    } = this.context.sequelize.models

    try {
      const seoPage = await seoPagesModel.findOne({ where: { slug } })
      if (seoPage) return this.addError('SeoPageSlugAlreadyExistsErrorType')
      await seoPagesModel.create({ slug, title, description, noIndex, isActive, canonicalUrl }, transaction)

      await populateSeoPagesCache(transaction)
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
