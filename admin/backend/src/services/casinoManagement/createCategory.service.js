import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    // adminUserId: { type: 'object' },
    name: { type: 'object' },
    file: { type: 'object' },
    uniqueId: { type: 'string' },
    isActive: { type: 'boolean', default: true },
    isSidebar: { type: 'boolean', default: false },
    isLobbyPage: { type: 'boolean', default: true },
    slug: { type: 'string' }
  },
  required: ['name', 'uniqueId', 'slug']
})

export class CreateCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */

    const { file, uniqueId, name, isActive, slug, isSidebar, isLobbyPage } = this.args

    const transaction = this.context.sequelizeTransaction
    const casinoSubCategoryModel = this.context.sequelize.models.casinoCategory
    try {
      const CategoryExists = await casinoSubCategoryModel.findOne({ where: { [Op.or]: { 'name.EN': name.EN, uniqueId } }, transaction })
      if (CategoryExists) return this.addError('SubCategoryAlreadyExistsErrorType')

      const categoryName = await getLanguageWiseNameJson(name)
      const category = await casinoSubCategoryModel.create({
        name: categoryName,
        uniqueId,
        isActive,
        isSidebar,
        isLobbyPage,
        slug
      }, { transaction })

      if (file) {
        const fileLocation = await uploadFile(file.buffer, {
          name: `${category.uniqueId}_${Date.now()}`,
          mimetype: file.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.casino.subCategories
        })
        category.iconUrl = fileLocation
      }

      console.log("this.args.adminUserId", this.args.adminUserId)

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: category.id,
        entityType: 'casinoCategory',
        action: 'create',
        changeTableId: category.id,
        changeTableName: 'casino_categories',
        previousData: { category: null },
        modifiedData: { category: category.get({ plain: 'true' }) },
        service: 'createCategory',
        category: tableCategoriesMapping.casino_categories
      })

      await category.save({ transaction })

      return { category }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
