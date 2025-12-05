import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import _ from 'lodash'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: 'string' },
    countryCodes: { type: 'array' }
  },
  required: ['gameId', 'countryCodes']
})

export class GameRemoveRestrictedCountriesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction

    try {
      const game = await this.context.sequelize.models.casinoGame.findOne({ where: { id: this.args.gameId }, transaction })
      if (!game) return this.addError('ProviderNotFoundErrorType')

      const countries = await this.context.sequelize.models.country.findOne({
        attributes: [[Sequelize.fn('ARRAY_AGG', Sequelize.col('id')), 'countryIds']],
        where: { code: { [Op.in]: this.args.countryCodes } },
        raw: true,
        transaction
      })

      game.restrictedCountries = _.difference(game.restrictedCountries, countries.countryIds)

      await game.save({ transaction })

      return { game }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
