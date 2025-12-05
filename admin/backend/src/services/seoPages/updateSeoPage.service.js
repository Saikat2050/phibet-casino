import { APIError } from '@src/errors/api.error'
import { populateSeoPagesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    seoPageId: { type: 'number' },
    slug: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    noIndex: { type: 'boolean' },
    canonicalUrl: { type: 'string' },
    isActive: { type: 'boolean' }
  },
  required: ['seoPageId']
})

export class UpdateSeoPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { slug, title, description, noIndex, seoPageId, canonicalUrl } = this.args
    const transaction = this.context.sequelizeTransaction
    const {
      seoPages: seoPagesModel
    } = this.context.sequelize.models
    const newPage = {}

    try {
      const seoPage = await seoPagesModel.findOne({ where: { id: seoPageId }, transaction })
      if (!seoPage) return this.addError('SeoPageNotFoundErrorType')

      newPage.slug = slug || seoPage.slug
      newPage.title = title || seoPage.title
      newPage.description = description || seoPage.description
      newPage.noIndex = noIndex
      newPage.canonicalUrl = canonicalUrl || null
      // seoPage.isActive = isActive || false

      await seoPagesModel.update(newPage, { where: { id: seoPageId }, transaction })
      await populateSeoPagesCache(transaction)

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
