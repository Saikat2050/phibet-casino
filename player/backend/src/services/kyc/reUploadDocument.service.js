import { ALLOWED_FILE_TYPES, FILE_SIZE_LIMITS } from '@src/utils/constants/public.constants.utils'
import ServiceBase from '@src/libs/serviceBase'
import { s3 } from '@src/libs/s3'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

export class ReUploadDocumentService extends ServiceBase {
  async run () {
    const { userId, documentId, file, transaction } = this.args
    const { sequelize } = this.context
    const { userDocument, documentLabel, kycActivityLog } = sequelize.models
    try {
      const existingDocument = await userDocument.findOne({ where: { id: documentId, userId } })
      if (!existingDocument) return this.addError('DocumentNotFound', 'Document not found or access denied')
      if (existingDocument.status === 'APPROVED') return this.addError('DocumentApprovedError', 'Cannot re-upload approved documents')
      const validationResult = await this.validateFile(file)
      if (!validationResult.isValid) return this.addError('FileValidationError', validationResult.error)
      const label = await documentLabel.findOne({ where: { id: existingDocument.documentLabelId, isActive: true } })
      if (!label) return this.addError('DocumentLabelNotFound', 'Document label not found')
      const labelValidation = this.validateAgainstLabel(file, label)
      if (!labelValidation.isValid) return this.addError('DocumentLabelValidationError', labelValidation.error)
      await this.deleteOldFile(existingDocument.fileName)
      const uploadResult = await this.uploadToS3(file, userId)
      if (!uploadResult.success) return this.addError('FileUploadError', uploadResult.error)
      await userDocument.update({
        fileName: uploadResult.data.fileName,
        originalFileName: file.originalname,
        fileUrl: uploadResult.data.fileUrl,
        fileSize: uploadResult.data.fileSize,
        mimeType: uploadResult.data.mimeType,
        status: 'PENDING',
        rejectionReason: null,
        reviewedAt: null,
        reviewedBy: null,
        uploadedAt: new Date(),
        metadata: {
          ...uploadResult.data.metadata,
          reUploadedAt: new Date(),
          previousStatus: 'REJECTED'
        }
      }, { where: { id: documentId, userId }, transaction })
      await kycActivityLog.create({
        userId,
        action: 'DOCUMENT_REUPLOADED',
        description: `Document re-uploaded: ${label.name}`,
        metadata: {
          documentId,
          fileName: file.originalname,
          fileSize: file.size
        }
      }, { transaction })
      return { result: {
        documentId,
        fileName: uploadResult.data.fileName,
        fileUrl: uploadResult.data.fileUrl,
        status: 'PENDING'
      } }
    } catch (error) {
      return this.addError('ReUploadDocumentError', error.message)
    }
  }
  async validateFile (file) {
    if (!file) return { isValid: false, error: 'No file provided' }
    if (!ALLOWED_FILE_TYPES.ALL.includes(file.mimetype)) {
      return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, and PDF files are allowed.' }
    }
    if (file.size > FILE_SIZE_LIMITS.MAX) {
      return { isValid: false, error: `File size exceeds maximum limit of ${FILE_SIZE_LIMITS.MAX / (1024 * 1024)}MB` }
    }
    return { isValid: true }
  }
  validateAgainstLabel (file, label) {
    if (!label.allowedFileTypes.includes(file.mimetype)) {
      return { isValid: false, error: `File type not allowed for ${label.name}` }
    }
    if (file.size > label.maxFileSize) {
      return { isValid: false, error: `File size exceeds limit for ${label.name}` }
    }
    return { isValid: true }
  }
  async deleteOldFile (fileName) {
    try {
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName
      }
      await s3.deleteObject(deleteParams).promise()
    } catch (error) {
      console.error('Failed to delete old file from S3:', error)
    }
  }
  async uploadToS3 (file, userId) {
    try {
      const fileExtension = path.extname(file.originalname)
      const fileName = `kyc/${userId}/${uuidv4()}${fileExtension}`
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private'
      }
      const result = await s3.upload(uploadParams).promise()
      return {
        success: true,
        data: {
          fileName,
          fileUrl: result.Location,
          fileSize: file.size,
          mimeType: file.mimetype
        }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
export default ReUploadDocumentService;
