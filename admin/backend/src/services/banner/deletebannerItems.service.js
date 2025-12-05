import { APIError } from '@src/errors/api.error'
import { deleteFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    bannerItemId: { type: 'number' }
  },
  required: ['bannerItemId']
})

export class DeleteBannerItemsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { bannerItem: BannerItem } = this.context.sequelize.models
    const bannerItemId = this.args.bannerItemId
    try {
      const bannerItem = await BannerItem.findOne({
        where: { id: bannerItemId },
        transaction
      })

      if (!bannerItem) {
        return this.addError('BannerNotFoundErrorType')
      }

      const { imageUrl, mobileImageUrl } = bannerItem
      const failedFiles = []

      if (imageUrl) {
        try {
          await deleteFile(imageUrl, S3FolderHierarchy.banner)
        } catch (err) {
          failedFiles.push(imageUrl)
        }
      }

      if (mobileImageUrl) {
        try {
          await deleteFile(mobileImageUrl, S3FolderHierarchy.banner)
        } catch (err) {
          failedFiles.push(mobileImageUrl)
        }
      }

      if (failedFiles.length > 0) {
        return this.addError('ImageUrlNotFoundErrorType')
      }

      await BannerItem.destroy({
        where: { id: bannerItemId },
        transaction
      })

      return {
        success: true,
        message: 'Banner item and associated files deleted successfully'
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}