import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { QUERY_STATUS } from '@src/utils/constants/public.constants.utils'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { uploadFile } from '@src/libs/s3'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    subject: { type: 'string' },
    message: { type: 'string' },
    file: { type: 'object' }
  },
  required: ['userId', 'subject', 'message']
})

export class CreateUserDisputesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const file = this.args.file
      const transaction = this.context.sequelizeTransaction
      const mainThread = await this.context.sequelize.models.mainThread.create({
        subject: this.args.subject,
        userId: this.args.userId,
        status: QUERY_STATUS.ACTIVE
      }, { transaction })
      const threadMessage = await this.context.sequelize.models.threadMessage.create({
        userId: this.args.userId,
        threadId: mainThread.id,
        content: this.args.message
      }, { transaction })

      if (file) {
        const fileLocation = await uploadFile(file.buffer, {
          name: String(mainThread.id),
          mimetype: file.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.query
        })
        await this.context.sequelize.models.threadAttachement.create({
          messageId: threadMessage.id,
          filePath: fileLocation
        }, { transaction })
      }

      return { mainThread }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
