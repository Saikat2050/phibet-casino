import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import ServiceBase from '@src/libs/serviceBase'
import { emitDisputeMessage } from '@src/socket-resources/emitters/disputeManagement.emitter'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    threadId: { type: 'string' },
    message: { type: 'string' },
    file: { type: 'object' }
  },
  required: ['userId', 'message', 'threadId']
})

export class CreateDisputeMessageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      /** @type {Express.Multer.File} */
      const file = this.args.file
      const transaction = this.context.sequelizeTransaction

      const threadMessage = await this.context.sequelize.models.threadMessage.create({
        userId: this.args.userId,
        threadId: this.args.threadId,
        content: this.args.message
      }, { transaction })

      if (file) {
        const fileLocation = await uploadFile(file.buffer, {
          name: String(this.args.threadId),
          mimetype: file.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.query
        })
        await this.context.sequelize.models.threadAttachement.create({
          messageId: threadMessage.id,
          filePath: fileLocation
        }, { transaction })
      }
      emitDisputeMessage(threadMessage)
      return { threadMessage }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
