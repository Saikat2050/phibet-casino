import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { DOCUMENT_STATUS, KYC_ACTIONS,KYC_STATUS, ENTITY_TYPES } from '@src/utils/constants/public.constants.utils'
import { CreateKycActivityLogService } from './createKycActivityLog.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'number' },
    documentId: { type: 'number' },
    reason: { type: ['string', 'null'] },
    metadata: { type: 'object' }
  },
  required: ['adminUserId', 'documentId']
})

export class ApproveDocumentService extends ServiceBase {
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
            attributes: ['id', 'username', 'kycStatus', 'kycLevel']
          },
          {
            model: sequelize.models.documentLabel,
            as: 'documentLabel',
            attributes: ['id', 'name', 'kycLevel']
          }
        ],
        transaction
      })

      if (!document) {
        return this.addError('DocumentDoesNotExistsErrorType')
      }

      if (document.status === DOCUMENT_STATUS.APPROVED) {
        return this.addError('DocumentAlreadyApprovedErrorType')
      }

      const previousStatus = document.status

      // Update document status
      await document.update({
        status: DOCUMENT_STATUS.APPROVED,
        reviewedBy: adminUserId,
        reviewedAt: new Date(),
        metadata: { ...document.metadata, ...metadata }
      }, { transaction })

      // Log activity
      await CreateKycActivityLogService.execute({
        userId: document.userId,
        adminUserId,
        action: KYC_ACTIONS.DOCUMENT_APPROVED,
        entityType: ENTITY_TYPES.DOCUMENT,
        entityId: documentId,
        previousStatus,
        newStatus: DOCUMENT_STATUS.APPROVED,
        reason,
        metadata: {
          documentLabel: document.documentLabel.name,
          documentLabelId: document.documentLabelId,
          ...metadata
        }
      }, this.context)

      // Check if all required documents are approved for this user
      await this.checkAndUpdateUserKycStatus(document.userId, transaction)

      return { success: true, document }
    } catch (error) {
      throw new APIError(error)
    }
  }

  async checkAndUpdateUserKycStatus (userId, transaction) {
    // Get all required document labels
    const requiredLabels = await sequelize.models.documentLabel.findAll({
      where: { isRequired: true, isActive: true },
      transaction
    })
    
    if (requiredLabels.length === 0) return

    // Get user's documents for required labels
    const userDocuments = await sequelize.models.userDocument.findAll({
      where: {
        userId,
        documentLabelId: requiredLabels.map(label => label.id)
      },
      transaction
    })

    // Check if all required documents are approved
    const allApproved = requiredLabels.every(label => {
      const userDoc = userDocuments.find(doc => doc.documentLabelId === label.id)
      return userDoc && userDoc.status === DOCUMENT_STATUS.APPROVED
    })

    if (allApproved) {
      // Update user KYC status to completed
      const user = await sequelize.models.user.findByPk(userId, { transaction })
      if (user && user.kycStatus !== KYC_STATUS.COMPLETED) {
        await user.update({
          kycStatus: KYC_STATUS.COMPLETED,
          kycVerifiedAt: new Date(),
          kycLastActivity: new Date()
        }, { transaction })

        // Log KYC completion
        await CreateKycActivityLogService.execute({
          userId,
          adminUserId: this.args.adminUserId,
          action: KYC_ACTIONS.KYC_VERIFIED,
          entityType: ENTITY_TYPES.KYC,
          entityId: userId,
          previousStatus: user.kycStatus,
          newStatus: KYC_STATUS.COMPLETED,
          reason: 'All required documents approved',
          metadata: { documentsCount: userDocuments.length }
        }, this.context)
      }
    }
  }
} 