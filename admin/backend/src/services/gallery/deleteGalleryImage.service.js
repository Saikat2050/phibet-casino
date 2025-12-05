import { APIError } from '@src/errors/api.error'
import { populateSettingsCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { deleteFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy, SETTING_KEYS } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' }
  },
  required: ['name']
})

export class DeleteGalleryImageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const name = this.args.name
    const transaction = this.context.sequelizeTransaction

    try {
      const gallery = await this.context.sequelize.models.setting.findOne({ where: { key: SETTING_KEYS.GALLERY }, transaction })
      const imageArray = JSON.parse(gallery.value)

      const imageUrl = imageArray.find(val => val === name)
      if (!imageUrl) return this.addError('InvalidImageNameErrorType')

      await deleteFile(imageUrl.split('/').splice(-1)[0], S3FolderHierarchy.gallery)
      gallery.value = JSON.stringify(imageArray.filter(val => val !== imageUrl))

      await this.context.sequelize.models.setting.update({ value: gallery.value }, { where: { key: SETTING_KEYS.GALLERY }, transaction })
      await populateSettingsCache(this.context)

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
