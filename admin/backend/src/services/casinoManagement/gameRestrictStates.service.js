import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import _ from 'lodash'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    gameId: { type: 'string' },
    stateCodes: { type: 'array' }
  },
  required: ['gameId', 'stateCodes', 'adminUserId']
})

export class GameRestrictStatesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { gameId, stateCodes } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const game = await this.context.sequelize.models.casinoGame.findOne({ where: { id: gameId }, transaction })
      if (!game) return this.addError('GameNotFoundErrorType')

      const states = await this.context.sequelize.models.state.findOne({
        attributes: [[Sequelize.fn('ARRAY_AGG', Sequelize.col('id')), 'stateIds']],
        where: { code: { [Op.in]: stateCodes } },
        raw: true,
        transaction
      })
      const previousData = game.restrictedStates
      const newRestrictedStates = _.difference(states.stateIds, game.restrictedStates)
      game.restrictedStates = game.restrictedStates.concat(newRestrictedStates)
      const modifiedData = game.restrictedStates

      await game.save({ transaction })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: game.casinoProviderId,
        entityType: 'casinoProvider',
        action: 'update',
        changeTableId: game.id,
        changeTableName: 'casino_games',
        previousData: { restrictedStates: previousData },
        modifiedData: { restrictedStates: modifiedData },
        service: 'gameRestrictStates',
        category: tableCategoriesMapping.casino_games
      })

      return { game }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
