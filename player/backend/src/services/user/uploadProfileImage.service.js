import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import ServiceBase from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    file: { type: 'object' },
    userId: { type: 'string' }
  },
  required: ['userId', 'file']
})

export class UploadProfileImageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const file = this.args.file
    const transaction = this.context.sequelizeTransaction

    try {
      const user = await this.context.sequelize.models.user.findOne({ attributes: ['id'], where: { id: this.args.userId }, transaction })
      if (!user) return this.addError('UserDoesNotExistsErrorType')

      const fileLocation = await uploadFile(file.buffer, {
        name: String(user.id),
        mimetype: file.mimetype,
        filePathInS3Bucket: S3FolderHierarchy.user.profileImages
      })
      user.imageUrl = fileLocation
      await user.save({ transaction })

      return { path: fileLocation }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
