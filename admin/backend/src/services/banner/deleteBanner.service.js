import { APIError } from '@src/errors/api.error'
import { populateBannerCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { deleteFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    imageUrl: { type: ['string', 'null'] },
    mobileImageUrl: { type: ['string', 'null'] },
    bannerId: { type: 'string' }
  },
  required: ['bannerId', 'adminUserId'],
  anyOf: [
    {
      required: ['imageUrl']
    },
    {
      required: ['mobileImageUrl']
    }
  ]
})

export class DeleteBannerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const newBanner = {}

    try {
      const banner = await this.context.sequelize.models.banner.findOne({ where: { id: this.args.bannerId }, transaction })
      if (!banner) return this.addError('BannerNotFoundErrorType')
      const previousData = {
        banner: {
          imageUrl: [...banner?.imageUrl],
          mobileImageUrl: [...banner?.mobileImageUrl]
        }
      }

      const modifiedData = {
        banner: {
          imageUrl: null,
          mobileImageUrl: null
        }
      }

      const { imageUrl, mobileImageUrl } = this.args
      const deletedBannerIndex = banner.mobileImageUrl.findIndex(image => mobileImageUrl === image)

      if (imageUrl) {
        await deleteFile(imageUrl, S3FolderHierarchy.banner)
        banner.imageUrl.splice(deletedBannerIndex, 1)
        newBanner.imageUrl = banner.imageUrl
        // banner.changed('imageUrl', true)
      }
      if (mobileImageUrl) {
        await deleteFile(mobileImageUrl, S3FolderHierarchy.banner)
        banner.mobileImageUrl.splice(deletedBannerIndex, 1)
        newBanner.mobileImageUrl = banner.mobileImageUrl
        // banner.changed('mobileImageUrl', true)
      }

      await this.context.sequelize.models.banner.update({ ...newBanner }, { where: { id: this.args.bannerId }, transaction })
      await populateBannerCache(this.context)

      logAdminActivity({
        adminUserId: this.args.adminUserId, // need to change it
        entityId: banner.id,
        entityType: 'banner',
        action: 'delete',
        changeTableId: banner.id,
        changeTableName: 'banner',
        previousData,
        modifiedData,
        service: 'delete banner',
        category: tableCategoriesMapping.banners

      })

      return banner
    } catch (error) {
      throw new APIError(error)
    }
  }
}
