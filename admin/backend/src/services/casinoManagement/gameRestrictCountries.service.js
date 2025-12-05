import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import _ from 'lodash'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    gameId: { type: 'string' },
    countryCodes: { type: 'array' }
  },
  required: ['gameId', 'countryCodes', 'adminUserId']
})

export class GameRestrictCountriesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction

    try {
      const game = await this.context.sequelize.models.casinoGame.findOne({ where: { id: this.args.gameId }, transaction })
      if (!game) return this.addError('GameNotFoundErrorType')

      const countries = await this.context.sequelize.models.country.findOne({
        attributes: [[Sequelize.fn('ARRAY_AGG', Sequelize.col('id')), 'countryIds']],
        where: { code: { [Op.in]: this.args.countryCodes } },
        raw: true,
        transaction
      })

      const previousData = game.restrictedCountries
      const newRestrictedCountries = _.difference(countries.countryIds, game.restrictedCountries)
      game.restrictedCountries = game.restrictedCountries.concat(newRestrictedCountries)
      const modifiedData = game.restrictedCountries

      await game.save({ transaction })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: game.casinoProviderId,
        entityType: 'casinoProvider',
        action: 'update',
        changeTableId: game.id,
        changeTableName: 'casinoGame',
        previousData: { restrictedStates: previousData },
        modifiedData: { restrictedStates: modifiedData },
        service: 'gameRestrictCountries'
      })

      return { game }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
