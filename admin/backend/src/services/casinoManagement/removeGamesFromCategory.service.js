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
    gameIds: { type: 'array' },
    categoryId: { type: 'string' },
    alternateCategoryId: { type: 'string' }
  },
  required: ['categoryId', 'gameIds', 'adminUserId']
})

export class RemoveGamesFromCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { alternateCategoryId, categoryId, gameIds } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const subCategory = await this.context.sequelize.models.casinoCategory.findOne({ where: { id: categoryId }, transaction })
      if (!subCategory) return this.addError('CategoryNotFoundErrorType')

      const defaultSubCategory = await this.context.sequelize.models.casinoCategory.findOne({ where: (alternateCategoryId ? { id: alternateCategoryId } : { isDefault: true }) })
      if (!defaultSubCategory) return this.addError('CategoryNotFoundErrorType')

      const previousData = gameIds.map((currentGameId) => ({
        gameId: currentGameId,
        casinoCategoryId: categoryId
      }))

      const modifiedData = gameIds.map((currentGameId) => ({
        gameId: currentGameId,
        casinoCategoryId: defaultSubCategory.id
      }))

      await this.context.sequelize.models.casinoGame.update({
        casinoCategoryId: defaultSubCategory.id
      }, {
        where: { id: { [Op.in]: gameIds } },
        transaction
      })
      await this.context.sequelize.models.casinoGameCategory.destroy({
        where: {
          casinoGameId: { [Op.in]: gameIds },
          casinoCategoryId: categoryId
        },
        transaction
      })
      if (defaultSubCategory) {
        // Fetch existing associations for the default category
        const existingAssociations = await this.context.sequelize.models.casinoGameCategory.findAll({
          where: {
            casinoGameId: { [Op.in]: gameIds },
            casinoCategoryId: defaultSubCategory.id
          },
          attributes: ['casinoGameId'],
          transaction
        })

        // Extract game IDs that already have the default category
        const existingGameIds = existingAssociations.map((assoc) => assoc.casinoGameId)

        // Filter out game IDs that are already associated with the default category
        const gamesToAdd = gameIds.filter((gameId) => !existingGameIds.includes(gameId))

        if (gamesToAdd.length > 0) {
          // Prepare entries for games that are not yet associated with the default category
          const alternateCategoryEntries = gamesToAdd.map((gameId) => ({
            casinoGameId: gameId,
            casinoCategoryId: defaultSubCategory.id,
            createdAt: new Date(),
            updatedAt: new Date()
          }))

          // Bulk create only for the filtered game IDs
          await this.context.sequelize.models.casinoGameCategory.bulkCreate(alternateCategoryEntries, {
            transaction,
            ignoreDuplicates: true
          })
        }
      }

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        // entityId: gameIds.join(',')
        entityType: 'casinoProvider',
        action: 'update',
        // changeTableId: gameIds.join(','),
        changeTableName: 'casino_games',
        previousData: { previousCategoriesIds: previousData },
        modifiedData: { newCategoriesIds: modifiedData },
        service: 'removeGameFromCategory',
        category: tableCategoriesMapping.casino_games
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
