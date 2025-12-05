import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { deleteFile, uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { PROVIDER_TYPE } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    providerCredentialId: { type: 'string' },
    credentials: { type: 'object' },
    icon: { type: 'object' },
    providerType: { enum: Object.values(PROVIDER_TYPE) }
  },
  required: ['name', 'providerType', 'providerCredentialId']
})

export class UpdateCredentialsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const transaction = this.context.sequelizeTransaction
    const { name, credentials, icon, providerCredentialId, providerType } = this.args

    try {
      const providerCredential = await this.context.sequelize.models.providerCredentials.findOne({
        where: { id: providerCredentialId }
      })
      if (!providerCredential) return this.addError('CredentialsAlreadyExistsErrorType')

      providerCredential.name = name
      providerCredential.credentials = credentials
      providerCredential.providerType = providerType
      if (icon) {
        if (providerCredential.icon) await deleteFile(providerCredential.icon.split('/').splice(-1)[0], S3FolderHierarchy.providers)
        const fileLocation = await uploadFile(icon.buffer, {
          name: icon.originalname,
          mimetype: icon.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.providers
        })
        providerCredential.icon = fileLocation
      }
      await providerCredential.save({ transaction })
      return { providerCredential }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
