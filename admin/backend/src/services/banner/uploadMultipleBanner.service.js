import { APIError } from '@src/errors/api.error'
import { populateBannerCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    bannerId: { type: 'string' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: ['integer', 'null'] },
          imageUrl: { type: ['object', 'null'] },
          mobileImageUrl: { type: ['object', 'null'] },
          title: { type: ['string', 'null'] },
          description: { type: ['string', 'null'] },
          buttonText: { type: ['string', 'null'] },
          buttonLink: { type: ['string', 'null'] },
          order: { type: ['integer', 'null'] },
          isActive: { type: ['boolean', 'null'] }

        }
      }
    }
  },
  required: ['bannerId', 'items']
})

export class UploadMultipleBannersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    
    const { bannerId, items } = this.args
    console.log('foundargs', this.args)
    console.log('foundarg1', bannerId, items)
    const { banner: Banner, bannerItem: BannerItem } = this.context.sequelize.models
    const { sequelizeTransaction } = this.context

    const results = []
    try {
      const banner = await Banner.findOne({ where: { id: bannerId } })
      if (!banner) return this.addError('BannerNotFoundErrorType')

      for (const item of items) {
        const { id, imageUrl, mobileImageUrl, title, description, buttonText, buttonLink, order, isActive } = item
        let imageUrlLocation = null
        let mobileImageUrlLocation = null
        if (imageUrl) {
          imageUrlLocation = await uploadFile(imageUrl.buffer, {
            name: banner.type + `_desktop_${banner.id}_${Date.now()}`,
            mimetype: imageUrl.mimetype,
            filePathInS3Bucket: S3FolderHierarchy.banner
          })
        }
        if (mobileImageUrl) {
          mobileImageUrlLocation = await uploadFile(mobileImageUrl.buffer, {
            name: banner.type + `_mobile_${banner.id}_${Date.now()}`,
            mimetype: mobileImageUrl.mimetype,
            filePathInS3Bucket: S3FolderHierarchy.banner
          })
        }
        if (id) {
          // Update existing BannerItem
          const bannerItem = await BannerItem.findOne({ where: { id, bannerId } })
          if (!bannerItem) {
            results.push({ id, status: 'error', error: 'BannerItemNotFoundErrorType' })
            continue
          }
          await bannerItem.update({
            imageUrl: imageUrlLocation || bannerItem.imageUrl,
            mobileImageUrl: mobileImageUrlLocation || bannerItem.mobileImageUrl,
            title: title !== undefined ? title : bannerItem.title,
            description: description !== undefined ? description : bannerItem.description,
            buttonText: buttonText !== undefined ? buttonText : bannerItem.buttonText,
            buttonLink: buttonLink !== undefined ? buttonLink : bannerItem.buttonLink,
            order: order !== undefined ? order : bannerItem.order,
            isActive: isActive !== undefined ? isActive : bannerItem.isActive

          }, { transaction: sequelizeTransaction })
          results.push({ id, status: 'updated', bannerItem })
        } else {
          // Create new BannerItem
          const bannerItem = await BannerItem.create({
            bannerId,
            imageUrl: imageUrlLocation,
            mobileImageUrl: mobileImageUrlLocation,
            title,
            description,
            buttonText,
            buttonLink,
            order,
            isActive: isActive !== undefined ? isActive : true

          }, { transaction: sequelizeTransaction })
          results.push({ id: bannerItem.id, status: 'created', bannerItem })
        }
      }
      await populateBannerCache(this.context)
      return { results }
    } catch (error) {
      throw new APIError(error)
    }
  }
}