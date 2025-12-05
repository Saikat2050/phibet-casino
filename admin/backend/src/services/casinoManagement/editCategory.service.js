import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { deleteFile, uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    categoryId: { type: 'string' },
    name: { type: 'object' },
    file: { type: 'object' },
    isActive: { type: ['string', 'boolean'] },
    isSidebar: { type: ['string', 'boolean'] },
    isLobbyPage: { type: ['string', 'boolean'] },
    slug: { type: 'string' }
  },
  required: ['categoryId', 'adminUserId']
})

export class EditCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */

    const { slug, file, name } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const category = await this.context.sequelize.models.casinoCategory.findOne({ where: { id: this.args.categoryId }, transaction })
      if (!category) return this.addError('SubCategoryNotFoundErrorType')

      const previousData = category.get({ plain: true })

      if (name) {
        category.name = await getLanguageWiseNameJson(name, category.name)
        category.changed('name', true)
      }
      if (slug) category.slug = slug
      if (file) {
        if (category.iconUrl) await deleteFile(category.iconUrl, S3FolderHierarchy.casino.categories)

        const fileLocation = await uploadFile(file.buffer, {
          name: `${category.uniqueId}_${Date.now()}`,
          mimetype: file.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.casino.categories
        })
        category.iconUrl = fileLocation
      }

      if (typeof this.args.isActive === 'string') category.isActive = JSON.parse(this.args.isActive)
      else category.isActive = this.args.isActive

      if (typeof this.args.isSidebar === 'string') category.isSidebar = JSON.parse(this.args.isSidebar)
      else category.isSidebar = this.args.isSidebar

      if (typeof this.args.isLobbyPage === 'string') category.isLobbyPage = JSON.parse(this.args.isLobbyPage)
      else category.isLobbyPage = this.args.isLobbyPage

      await category.save({ transaction })

      const modifiedData = category?.get({ plain: true })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: category?.id,
        entityType: 'casinoCategory',
        action: 'update',
        changeTableId: category?.id,
        changeTableName: 'casino_categories',
        previousData: { category: previousData },
        modifiedData: { category: modifiedData },
        service: 'editCategory',
        category: tableCategoriesMapping.casino_categories
      })

      return { category }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
