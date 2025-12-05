import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { DOCUMENT_STATUS, KYC_ACTIONS, ENTITY_TYPES, KYC_STATUS } from '@src/utils/constants/public.constants.utils'
import { CreateKycActivityLogService } from './createKycActivityLog.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'number' },
    documentId: { type: 'number' },
    reason: { type: 'string' },
    metadata: { type: 'object' }
  },
  required: ['adminUserId', 'documentId', 'reason']
})

export class RejectDocumentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { adminUserId, documentId, reason, metadata = {} } = this.args

    try {
      // Find the document
      const document = await sequelize.models.userDocument.findByPk(documentId, {
        include: [
          {
            model: sequelize.models.user,
            as: 'user',
            attributes: ['id', 'username', 'kycStatus']
          },
          {
            model: sequelize.models.documentLabel,
            as: 'documentLabel',
            attributes: ['id', 'name', 'isRequired']
          }
        ],
        transaction
      })

      if (!document) {
        return this.addError('DocumentDoesNotExistsErrorType')
      }

      if (document.status === DOCUMENT_STATUS.REJECTED) {
        return this.addError('DocumentAlreadyRejectedErrorType')
      }

      const previousStatus = document.status

      // Update document status
      await document.update({
        status: DOCUMENT_STATUS.REJECTED,
        rejectionReason: reason,
        reviewedBy: adminUserId,
        reviewedAt: new Date(),
        metadata: { ...document.metadata, ...metadata }
      }, { transaction })

      // Log activity
      await CreateKycActivityLogService.execute({
        userId: document.userId,
        adminUserId,
        action: KYC_ACTIONS.DOCUMENT_REJECTED,
        entityType: ENTITY_TYPES.DOCUMENT,
        entityId: documentId,
        previousStatus,
        newStatus: DOCUMENT_STATUS.REJECTED,
        reason,
        metadata: {
          documentLabel: document.documentLabel.name,
          documentLabelId: document.documentLabelId,
          ...metadata
        }
      }, this.context)
      console.log("comingheredaada", document)
      console.log("comingheredaada", document.documentLabel)

      if (document.documentLabel?.isRequired) {
        const user = await sequelize.models.user.findByPk(document.userId, { transaction })
        console.log("comingheredaada 1")

        if (user && user.kycStatus !== KYC_STATUS.REJECTED) {
          const previousUserStatus = user.kycStatus
          await user.update({
            kycStatus: KYC_STATUS.FAILED,
            kycLastActivity: new Date()
          }, { transaction })

          await CreateKycActivityLogService.execute({
            userId: user.id,
            adminUserId,
            action: KYC_ACTIONS.KYC_REJECTED,
            entityType: ENTITY_TYPES.KYC,
            entityId: user.id,
            previousStatus: previousUserStatus,
            newStatus: KYC_STATUS.FAILED,
            reason: 'Required document was rejected'
          }, this.context)
        }
      }
      return { success: true, document }
    } catch (error) {
      throw new APIError(error)
    }
  }
} 