import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { PROVIDER_TYPE } from '@src/utils/constants/public.constants.utils'
import { uploadFile } from '@src/libs/s3'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    credentials: { type: 'object' },
    icon: { type: 'object' },
    providerType: { enum: Object.values(PROVIDER_TYPE) }
  },
  required: ['name', 'providerType']
})

export class CreateCredentialsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const transaction = this.context.sequelizeTransaction
    const { name, credentials, icon, providerType } = this.args

    try {
      const [providerCredentials, created] = await this.context.sequelize.models.providerCredentials.findOrCreate({
        defaults: { name, credentials, providerType },
        where: { name },
        transaction
      })
      if (!created) return this.addError('CredentialsAlreadyExistsErrorType')
      if (icon) {
        const fileLocation = await uploadFile(icon.buffer, {
          name: icon.originalname,
          mimetype: icon.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.providers
        })
        providerCredentials.icon = fileLocation
        await providerCredentials.save({ transaction })
      }
      return { providerCredentials, created }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
