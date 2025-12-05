import { APIError } from '@src/errors/api.error'
import { populateSeoPagesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    seoPageId: { type: 'string' }
  },
  required: ['seoPageId']
})

export class DeleteSeoPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction

    try {
      const seoPage = await this.context.sequelize.models.seoPages.findOne({ where: { id: this.args.seoPageId } })
      if (!seoPage) return this.addError('PageNotFoundErrorType')

      await seoPage.destroy({ transaction })
      await populateSeoPagesCache(transaction)
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
