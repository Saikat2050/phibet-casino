import { APIError } from '@src/errors/api.error'
import { populateLanguagesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    languageId: { type: 'string' }
  },
  required: ['languageId']
})

export class ToggleLanguageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const languageId = this.args.languageId
    const transaction = this.context.sequelizeTransaction

    try {
      const language = await this.context.sequelize.models.language.findOne({ where: { id: languageId } })
      if (!language) return this.addError('LanguageNotFoundErrorType')

      language.isActive = !language.isActive
      await language.save({ transaction })

      await populateLanguagesCache()
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
