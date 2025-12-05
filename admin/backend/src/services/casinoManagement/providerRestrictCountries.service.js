import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import _ from 'lodash'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    providerId: { type: 'string' },
    countryCodes: { type: 'array' }
  },
  required: ['providerId', 'countryCodes']
})

export class ProviderRestrictCountriesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction

    try {
      const provider = await this.context.sequelize.models.casinoProvider.findOne({ where: { id: this.args.providerId }, transaction })
      if (!provider) return this.addError('ProviderNotFoundErrorType')

      const countries = await this.context.sequelize.models.country.findOne({
        attributes: [[Sequelize.fn('ARRAY_AGG', Sequelize.col('id')), 'countryIds']],
        where: { code: { [Op.in]: this.args.countryCodes } },
        raw: true,
        transaction
      })

      const newRestrictedCountries = _.difference(countries.countryIds, provider.restrictedCountries)
      provider.restrictedCountries = provider.restrictedCountries.concat(newRestrictedCountries)

      await provider.save({ transaction })

      return { provider }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
