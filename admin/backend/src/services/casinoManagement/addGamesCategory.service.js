import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    categoryId: { type: 'string' },
    gameIds: { type: 'array' }
  },
  required: ['categoryId', 'gameIds', 'adminUserId']
})

export class AddGamesCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { categoryId, gameIds } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const category = await this.context.sequelize.models.casinoCategory.findOne({ where: { id: this.args.categoryId }, transaction })
      if (!category) return this.addError('CategoryNotFoundErrorType')

      const previousCategoriesIds = await this.context.sequelize.models.casinoGame.findAll({ attributes: ['id', 'casinoCategoryId'], where: { id: gameIds } })

      const previousData = previousCategoriesIds.map((currentGame) => ({
        gameId: currentGame.id,
        casinoCategoryId: currentGame.casinoCategoryId
      }))

      this.context.sequelize.models.casinoGame.update({
        casinoCategoryId: category.id
      }, {
        where: { id: { [Op.in]: gameIds } },
        transaction
      })
      const games = await this.context.sequelize.models.casinoGame.findAll({
        where: { id: { [Op.in]: gameIds } },
        transaction
      })

      if (games.length !== gameIds.length) {
        return this.addError('SomeGameNotFoundErrorType')
      }
      const existingAssociations = await this.context.sequelize.models.casinoGameCategory.findAll({
        where: {
          casinoGameId: { [Op.in]: gameIds },
          casinoCategoryId: categoryId
        },
        attributes: ['casinoGameId'],
        transaction
      })

      const existingGameIds = existingAssociations.map((assoc) => assoc.casinoGameId)
      const newGameIds = gameIds.filter((gameId) => !existingGameIds.includes(gameId))

      if (newGameIds.length === 0) {
        return this.addError('GamesAlreadyExistsErrorType')
      }

      const gameCategoryEntries = newGameIds.map((gameId) => ({
        casinoGameId: gameId,
        casinoCategoryId: categoryId,
        createdAt: new Date(),
        updatedAt: new Date()
      }))

      await this.context.sequelize.models.casinoGameCategory.bulkCreate(gameCategoryEntries, {
        transaction,
        ignoreDuplicates: true
      })

      const modifiedData = gameIds.map((currentGameId) => ({
        gameId: currentGameId,
        casinoCategoryId: categoryId
      }))

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        // entityId: game.casinoProviderId,
        entityType: 'casinoProvider',
        action: 'update',
        // changeTableId: gameIds,
        changeTableName: 'casino_games',
        previousData: { gameCategoryId: previousData },
        modifiedData: { gameCategoryId: modifiedData },
        service: 'editGame',
        category: tableCategoriesMapping.casino_games
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
