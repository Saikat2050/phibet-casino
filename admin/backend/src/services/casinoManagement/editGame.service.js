import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import dayjs from 'dayjs'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    gameId: { type: 'string' },
    name: { type: 'object' },
    mobileFile: { type: 'object' },
    desktopFile: { type: 'object' },
    newProviderId: { type: 'string' },
    newCategoryId: { type: 'string' },
    setDefaultImage: { type: 'boolean' }
  },
  required: ['gameId', 'adminUserId']
})

export class EditGameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const {
      args: { mobileFile, desktopFile, name, newProviderId, newCategoryId },
      context: { sequelizeTransaction: transaction }
    } = this

    try {
      let fileLocation = ''
      const game = await this.context.sequelize.models.casinoGame.findOne({ where: { id: this.args.gameId }, transaction })
      if (!game) return this.addError('GameNotFoundErrorType')

      const previousData = game.get({ plain: 'true' })
      if (newProviderId) {
        const provider = await this.context.sequelize.models.casinoProvider.findOne({ where: { id: newProviderId }, transaction })
        if (!provider) return this.addError('ProviderNotFoundErrorType')

        game.casinoProviderId = provider.id
      }
      if (newCategoryId) {
        const category = await this.context.sequelize.models.casinoCategory.findOne({ where: { id: newCategoryId }, transaction })
        if (!category) return this.addError('SubCategoryNotFoundErrorType')

        game.casinoCategoryId = category.id
      }
      if (name) {
        game.name = await getLanguageWiseNameJson(name, game.name)
        game.changed('name', true)
      }
      if (mobileFile && Object.keys(mobileFile).length > 0) {
        fileLocation = await uploadFile(mobileFile.buffer, {
          name: `provider_mobile_${dayjs().format('YYYYMMDD_HHmmss')}`,
          mimetype: mobileFile.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.casino.games
        })
        game.mobileImageUrl = fileLocation
      }

      if (desktopFile && Object.keys(desktopFile).length > 0) {
        fileLocation = await uploadFile(desktopFile.buffer, {
          name: `provider_desktop_${dayjs().format('YYYYMMDD_HHmmss')}`,
          mimetype: desktopFile.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.casino.games
        })
        game.desktopImageUrl = fileLocation
      }

      await game.save({ transaction })
      const modifiedData = game.get({ plain: true })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: game.casinoProviderId,
        entityType: 'casinoProvider',
        action: 'update',
        changeTableId: game.id,
        changeTableName: 'casino_games',
        previousData: { game: previousData },
        modifiedData: { game: modifiedData },
        service: 'editGame',
        category: tableCategoriesMapping.casino_games
      })

      return { game }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
