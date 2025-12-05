import ServiceBase from '@src/libs/serviceBase'
import { s3 } from '@src/libs/s3'

export class DeleteDocumentService extends ServiceBase {
  async run () {
    const { userId, documentId, transaction } = this.args
    const { sequelize } = this.context
    const { userDocument, kycActivityLog } = sequelize.models
    try {
      const document = await userDocument.findOne({ where: { id: documentId, userId } })
      if (!document) return this.addError('DocumentNotFound', 'Document not found or access denied')
      if (document.status === 'APPROVED') return this.addError('DocumentApprovedError', 'Cannot delete approved documents')
      const s3DeleteResult = await this.deleteFromS3(document.fileName)
      if (!s3DeleteResult.success) console.error('S3 deletion failed:', s3DeleteResult.error)
      await document.destroy({ transaction })
      await kycActivityLog.create({
        userId,
        action: 'DOCUMENT_DELETED',
        description: `Document deleted: ${document.originalFileName}`,
        metadata: { documentId }
      }, { transaction })
      return { result: { message: 'Document deleted successfully' } }
    } catch (error) {
      return this.addError('DeleteDocumentError', error.message)
    }
  }
  async deleteFromS3 (fileName) {
    try {
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName
      }
      await s3.deleteObject(deleteParams).promise()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
export default DeleteDocumentService;
