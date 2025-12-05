import { APIError } from '@src/errors/api.error'
import { populatePagesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    pageId: { type: 'string' }
  },
  required: ['pageId']
})

export class TogglePageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const pageId = this.args.pageId

    try {
      const page = await this.context.sequelize.models.page.findOne({ where: { id: pageId } })
      if (!page) return this.addError('PageNotFoundErrorType')

      page.isActive = !page.isActive
      await this.context.sequelize.models.page.update({ ...page }, { where: { id: pageId } })
      await populatePagesCache(this.context)
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
