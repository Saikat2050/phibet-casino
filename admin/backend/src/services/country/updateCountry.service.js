import { APIError } from '@src/errors/api.error'
import { populateCountriesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    countryId: { type: 'string' },
    languageId: { type: 'string' },
    name: { type: 'string' }
  },
  required: ['countryId']
})

export class UpdateCountryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const name = this.args.name
    const countryId = this.args.countryId
    const languageId = this.args.languageId

    try {
      const country = await this.context.sequelize.models.country.findOne({ where: { id: countryId } })
      if (!country) return this.addError('CountryNotFoundErrorType')

      if (name) country.name = name
      if (languageId) {
        const language = await this.context.sequelize.models.language.findOne({ where: { id: languageId } })
        if (!language) return this.addError('LanguageNotFoundErrorType')
        country.languageId = language.id
      }

      await country.save()
      await populateCountriesCache()
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
