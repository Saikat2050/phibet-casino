import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    gameIds: { type: 'array' }
  },
  required: ['gameIds', 'adminUserId']
})

export class ReorderGameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const gameIds = [...(new Set(this.args.gameIds))]
    const transaction = this.context.sequelizeTransaction

    try {
      const previousOrderIds = await this.context.sequelize.models.casinoGame.findAll({
        where: { id: gameIds },
        attributes: ['id', 'orderId'],
        raw: true
      })
      const previousOrderIdsMap = previousOrderIds.reduce((acc, currGame) => {
        acc[currGame.id] = currGame.orderId
        return acc
      }, {})
      const previousData = gameIds.map(gameId => ({
        id: gameId,
        orderId: previousOrderIdsMap[gameId] || null
      }))

      await Promise.all(gameIds.map(async (gameId, index) => {
        await this.context.sequelize.models.casinoGame.update({ orderId: index + 1 }, { where: { id: gameId }, transaction })
      }))

      const modifiedData = gameIds.map((gameId, index) => ({
        id: gameId,
        orderId: index + 1
      }))

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        // entityId: gameIds.join(','),
        entityType: 'casinoProvider',
        action: 'update',
        // changeTableId: gameIds.join(','),
        changeTableName: 'casino_games',
        previousData: { categoriesIds: previousData },
        modifiedData: { categoriesIds: modifiedData },
        service: 'reorderGames',
        category: tableCategoriesMapping.casino_games,
        moreDetails: { gameIds: gameIds.join(',') }

      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
