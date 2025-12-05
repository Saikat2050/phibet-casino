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

export class UpdateLogoService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const file = this.args.file
    const transaction = this.context.sequelizeTransaction

    try {
      const fileLocation = await uploadFile(file.buffer, {
        name: `logo_${Date.now()}`,
        mimetype: file.mimetype,
        filePathInS3Bucket: S3FolderHierarchy.common
      })

      await this.context.sequelize.models.setting.update({
        value: fileLocation
      }, { where: { key: SETTING_KEYS.LOGO }, transaction })

      await populateSettingsCache(this.context)
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
