import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    gameId: { type: 'string' }
  },
  required: ['gameId']
})

export class ToggleFeaturedGameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const game = await this.context.sequelize.models.casinoGame.findOne({ where: { id: this.args.gameId }, attributes: ['id', 'isFeatured'] })
      if (!game) return this.addError('GameNotFoundErrorType')

      const previousData = game.isFeatured
      game.isFeatured = !game.isFeatured
      const modifiedData = game.isFeatured
      await game.save()

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: game?.casinoProviderId,
        entityType: 'casinoProvider',
        action: 'update',
        changeTableId: game?.id,
        changeTableName: 'casino_games',
        previousData: { isFeatured: previousData },
        modifiedData: { isFeatured: modifiedData },
        service: 'toggleFeaturedGame',
        category: tableCategoriesMapping.casino_games
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
