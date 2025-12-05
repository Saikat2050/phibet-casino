import { APIError } from '@src/errors/api.error'
import { populateCountriesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    countryId: { type: 'string' }
  },
  required: ['countryId']
})

export class ToggleCountryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const countryId = this.args.countryId

    try {
      const country = await this.context.sequelize.models.country.findOne({ where: { id: countryId } })
      if (!country) return this.addError('CountryNotFoundErrorType')

      country.isActive = !country.isActive
      await country.save()

      await populateCountriesCache()
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
