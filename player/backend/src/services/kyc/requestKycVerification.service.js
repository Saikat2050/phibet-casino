import { DOCUMENT_STATUS, KYC_ACTIONS, KYC_LEVELS, KYC_STATUS } from '@src/utils/constants/public.constants.utils'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
})

export class RequestKycVerificationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId } = this.args
    const { sequelize } = this.context
    const { user, userDocument, documentLabel, kycActivityLog } = sequelize.models

    const transaction = await sequelize.transaction()
    try {
      const userData = await user.findByPk(userId, {
        attributes: ['id', 'kycStatus', 'kycLevel'],
        transaction
      })
      if (!userData) return this.addError('UserNotFound', 'User not found')
        if (userData.kycLevel != KYC_LEVELS.LEVEL_3) {
          // Ensure levels 1 and 2 are completed before proceeding to level 3



            await transaction.rollback()
            return this.addError(
              'PreviousVerificationIncomplete',
              `You must complete KYC levels 1 and 2 (mobile and email verification) before requesting document verification`
            )

        }

      const currentLevel = userData.kycLevel
      const isFinalLevel = currentLevel === KYC_LEVELS.LEVEL_3
      const currentStatus = userData.kycStatus
      if (currentStatus === KYC_STATUS.IN_PROGRESS) {
        await transaction.rollback()
        return this.addError('KycAlreadyInProgress', 'KYC verification request is already in progress for your current level')
      }
      if (currentStatus === KYC_STATUS.COMPLETED) {
        await transaction.rollback()
        return this.addError('KycAlreadyCompleted', 'KYC verification request is already completed for your current level')
      }
      // Get required documents for current KYC level
      const requiredDocs = await documentLabel.findAll({
        where: { kycLevel: currentLevel, isRequired: true, isActive: true },
        transaction
      })

      if (requiredDocs.length === 0) {
        await transaction.rollback()
        return this.addError('NoRequiredDocuments', 'No required documents defined for this KYC level')
      }

      // Get uploaded documents
      const uploadedDocs = await userDocument.findAll({
        where: {
          userId,
          status: {
            [Op.or]: [DOCUMENT_STATUS.PENDING, DOCUMENT_STATUS.RE_REQUESTED]
          }
        },
        include: [{
          model: documentLabel,
          as: 'documentLabel',
          where: { kycLevel: currentLevel }
        }],
        transaction
      })

      // Filter required documents that are uploaded
      const uploadedRequiredDocs = uploadedDocs.filter(doc => doc.documentLabel?.isRequired)

      if (uploadedRequiredDocs.length < requiredDocs.length) {
        await transaction.rollback()
        return this.addError(
          'IncompleteDocuments',
          'Please upload all required documents before requesting verification'
        )
      }

      // Update user status
      await userData.update({
        kycStatus: KYC_STATUS.IN_PROGRESS,
        kycLastActivity: new Date(),
        kycLevel: currentLevel
      }, { transaction })

      await kycActivityLog.create({
        userId,
        action: KYC_ACTIONS.KYC_VERIFICATION_REQUESTED,
        description: `KYC verification requested for level ${currentLevel}`,
        previousStatus:currentStatus,
        newStatus:KYC_STATUS.IN_PROGRESS,
        metadata: {
          kycLevel: currentLevel,
          documentsSubmitted: uploadedRequiredDocs.map(doc => doc.fileName)
        }
      }, { transaction })

      await transaction.commit()

      return {
        result: {
          message: `KYC level ${currentLevel} verification submitted successfully`,
          kycStatus: KYC_STATUS.IN_PROGRESS,
          nextLevel: isFinalLevel ? null : currentLevel + 1,
          documentsCount: uploadedRequiredDocs.length
        }
      }
    } catch (error) {
      await transaction.rollback()
      return this.addError('RequestKycVerificationError', error.message)
    }
  }
}

export default RequestKycVerificationService
