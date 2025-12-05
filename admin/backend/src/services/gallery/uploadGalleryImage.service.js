import { APIError } from '@src/errors/api.error'
import { populateSettingsCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy, SETTING_KEYS } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    file: { type: 'object' }
  },
  required: ['file']
})

export class UploadGalleryImageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const file = this.args.file
    const transaction = this.context.sequelizeTransaction

    try {
      const gallery = await this.context.sequelize.models.setting.findOne({ where: { key: SETTING_KEYS.GALLERY }, transaction })
      const imageArray = new Set(JSON.parse(gallery.value))

      const fileLocation = await uploadFile(file.buffer, {
        name: `${file.originalname.split('.')[0]}_${Date.now()}`,
        mimetype: file.mimetype,
        filePathInS3Bucket: S3FolderHierarchy.gallery
      })

      imageArray.add(fileLocation)
      gallery.value = JSON.stringify([...imageArray])

      await this.context.sequelize.models.setting.update({ value: gallery.value }, { where: { key: SETTING_KEYS.GALLERY }, transaction })
      await populateSettingsCache(this.context)

      return { file: fileLocation }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
