import { ALLOWED_FILE_TYPES, FILE_SIZE_LIMITS, KYC_ACTIONS, KYC_STATUS } from '@src/utils/constants/public.constants.utils'
import ServiceBase from '@src/libs/serviceBase'
import { uploadFile } from '@src/libs/s3'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import ajv from '@src/libs/ajv'
import { DOCUMENT_STATUS } from '@src/utils/constants/public.constants.utils'
const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    documentLabelId: { type: 'number' },
    file: { type: 'object' }
  },
  required: ['userId', 'documentLabelId', 'file']
})

export class UploadDocumentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, documentLabelId, file } = this.args
    const { sequelize } = this.context
    const { user, documentLabel, userDocument, kycActivityLog } = sequelize.models

    const transaction = await sequelize.transaction()
    try {
      // Fetch user
      const userRecord = await user.findOne({ where: { id: userId }, transaction })
      if (!userRecord) return this.addError('UserNotFound', 'User does not exist')

      // Get document label
      const label = await documentLabel.findOne({ where: { id: documentLabelId, isActive: true }, transaction })
      if (!label) return this.addError('DocumentLabelNotFound', 'Document label not found')

      // Upload file to S3
      const fileLocation = await uploadFile(file.buffer, {
        name: `${userId}-${Date.now()}`,
        mimetype: file.mimetype,
        filePathInS3Bucket: S3FolderHierarchy.user.documents
      })
      // const fileLocation = 'demolocation'

      if (!fileLocation) {
        return this.addError('FileUploadError', 'Failed to upload document to S3')
      }

      const expiryDate = new Date()
      expiryDate.setMonth(expiryDate.getMonth() + 1)

      // --- ✨ Change 1: Track previous document status ---
      let previousDocStatus = null
      let isReupload = false
      let document

      const existingDocument = await userDocument.findOne({
        where: { userId, documentLabelId },
        transaction
      })

      if (existingDocument) {
        isReupload = true
        previousDocStatus = existingDocument.status

        await existingDocument.update({
          fileName: label.name,
          fileUrl: fileLocation,
          expiryDate,
          metadata: {
            ...existingDocument.metadata,
            uploadedVia: 'user_upload',
            documentLabelName: label.name
          },
          status: DOCUMENT_STATUS.RE_REQUESTED,
          updatedAt: new Date()
        }, { transaction })

        document = existingDocument
      } else {
        document = await userDocument.create({
          userId,
          documentLabelId,
          fileName: label.name,
          fileUrl: fileLocation,
          expiryDate,
          status: DOCUMENT_STATUS.PENDING,
          metadata: {
            uploadedVia: 'user_upload',
            documentLabelName: label.name
          }
        }, { transaction })
      }

      // --- ✨ Change 2: Update user kycStatus if needed ---
      if (userRecord.kycStatus !== KYC_STATUS.PENDING) {
        await userRecord.update({ kycStatus: KYC_STATUS.PENDING }, { transaction })
      }

      // --- ✨ Change 3: Log activity with correct previous status ---
      await kycActivityLog.create({
        userId,
        action: isReupload ? KYC_ACTIONS.DOCUMENT_RE_REQUESTED : KYC_ACTIONS.DOCUMENT_UPLOADED,
        entityType: 'userDocument',
        entityId: document.id,
        description: `${isReupload ? 'Re-uploaded' : 'Uploaded'} document: ${label.name}`,
        metadata: {
          documentLabelId,
          fileName: file.originalname,
          fileSize: file.size
        },
        previousStatus: previousDocStatus,
        newStatus: document.status
      }, { transaction })

      await transaction.commit()

      return {
        result: {
          documentId: document.id,
          fileName: document.fileName,
          fileUrl: document.fileUrl,
          status: document.status
        }
      }
    } catch (error) {
      await transaction.rollback()
      return this.addError('UploadDocumentError', error.message)
    }
  }
}


export default UploadDocumentService
