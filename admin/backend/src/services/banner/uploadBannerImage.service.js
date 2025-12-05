import { APIError } from '@src/errors/api.error'
import { populateBannerCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    bannerId: { type: 'string' },
    desktopImageUrl: { type: ['object'] },
    mobileImageUrl: { type: ['object'] }
  },
  required: ['bannerId', 'adminUserId'],
  anyOf: [
    {
      required: ['desktopImageUrl']
    },
    {
      required: ['mobileImageUrl']
    }
  ]
})

export class UploadBannerImageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const { bannerId, desktopImageUrl, mobileImageUrl } = this.args
    const sequelizeTransaction = this.context.sequelizeTransaction

    try {
      const banner = await this.context.sequelize.models.banner.findOne({ where: { id: bannerId } })
      if (!banner) return this.addError('BannerNotFoundErrorType')

      const previousData = {
        banner: {
          imageUrl: [...banner?.imageUrl],
          mobileImageUrl: [...banner?.mobileImageUrl]
        }
      }

      if (desktopImageUrl) {
        let index = 1
        const img = banner?.imageUrl?.[banner?.imageUrl?.length - 1]?.split('.')
        const lastIndex = img?.[img?.length - 2]?.[img?.[img?.length - 2]?.length - 1]
        if (lastIndex) index = +lastIndex + 1

        const fileLocation = await uploadFile(desktopImageUrl.buffer, {
          name: banner.type + `_${Date.now()}_desktop_${banner.id}_${index}`,
          mimetype: desktopImageUrl.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.banner
        })
        banner.imageUrl.push(fileLocation)
        banner.changed('imageUrl', true)
      }

      if (mobileImageUrl) {
        let index = 1
        const img = banner?.mobileImageUrl?.[banner?.mobileImageUrl?.length - 1]?.split('.')
        const lastIndex = img?.[img?.length - 2]?.[img?.[img?.length - 2]?.length - 1]
        if (lastIndex) index = +lastIndex + 1

        const fileLocation = await uploadFile(mobileImageUrl.buffer, {
          name: banner.type + `_${Date.now()}_mobile_${banner.id}_${index}`,
          mimetype: mobileImageUrl.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.banner
        })
        banner.mobileImageUrl.push(fileLocation)
        banner.changed('mobileImageUrl', true)
      }

      await banner.save({ transaction: sequelizeTransaction })
      await this.context.sequelize.models.banner.update({ ...banner }, { where: { id: bannerId }, transaction: sequelizeTransaction })
      await populateBannerCache(this.context)

      const modifiedData = {
        banner: {
          imageUrl: [...banner?.imageUrl],
          mobileImageUrl: [...banner?.mobileImageUrl]
        }
      }

      logAdminActivity({
        adminUserId: this.args.adminUserId, // need to change it
        entityId: banner.id,
        entityType: 'banner',
        action: 'update',
        changeTableId: banner.id,
        changeTableName: 'banner',
        previousData,
        modifiedData,
        service: 'upload banner image',
        category: tableCategoriesMapping.banners

      })

      return { banner }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
