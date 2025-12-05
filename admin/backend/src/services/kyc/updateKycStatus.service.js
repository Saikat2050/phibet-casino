import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { KYC_STATUS, KYC_LEVELS, KYC_ACTIONS, ENTITY_TYPES } from '@src/utils/constants/public.constants.utils'
import { CreateKycActivityLogService } from './createKycActivityLog.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'number' },
    userId: { type: 'number' },
    kycStatus: { 
      type: 'string',
      enum: Object.values(KYC_STATUS)
    },
    kycLevel: { 
      type: 'number',
      enum: Object.values(KYC_LEVELS)
    },
    reason: { type: ['string', 'null'] },
    metadata: { type: 'object' }
  },
  required: ['adminUserId', 'userId']
})

export class UpdateKycStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { adminUserId, userId, kycStatus, kycLevel, reason, metadata = {} } = this.args

    try {
      // Find the user
      const user = await sequelize.models.user.findByPk(userId, { transaction })
      if (!user) {
        return this.addError('UserDoesNotExistsErrorType')
      }
      console.log("statusupdatekyc")

      const previousKycStatus = user.kycStatus
      const previousKycLevel = user.kycLevel
      console.log("statusupdatekyc 1")

      // Prepare update data
      const updateData = {
        kycLastActivity: new Date(),
        kycMetadata: { ...user.kycMetadata, ...metadata }
      }
      console.log("statusupdatekyc 2")

      // Update KYC status if provided
      if (kycStatus) {
        updateData.kycStatus = kycStatus
        
        // Set verification details for completed status
        if (kycStatus === KYC_STATUS.COMPLETED) {
          updateData.kycVerifiedAt = new Date()
          updateData.kycVerifiedBy = adminUserId
        } else if (kycStatus === KYC_STATUS.FAILED) {
          updateData.kycRejectionReason = reason
        }
      }
      console.log("statusupdatekyc 3")

      // Update KYC level if provided
      if (kycLevel !== undefined) {
        updateData.kycLevel = kycLevel
      }

      // Update user
      await user.update(updateData, { transaction })
      console.log("statusupdatekyc 4")

      // Log activity for status change
      if (kycStatus && kycStatus !== previousKycStatus) {
      console.log("statusupdatekyc 5")

        await CreateKycActivityLogService.execute({
          userId,
          adminUserId,
          action: KYC_ACTIONS.KYC_STATUS_UPDATED,
          entityType: ENTITY_TYPES.KYC,
          entityId: userId,
          previousStatus: previousKycStatus,
          newStatus: kycStatus,
          reason,
          metadata: {
            kycLevel: user.kycLevel,
            ...metadata
          }
        }, this.context)
      }
      console.log("statusupdatekyc 6")

      // Log activity for level change
      if (kycLevel !== undefined && kycLevel !== previousKycLevel) {
      console.log("statusupdatekyc 7")

        await CreateKycActivityLogService.execute({
          userId,
          adminUserId,
          action: KYC_ACTIONS.KYC_LEVEL_UPDATED,
          entityType: ENTITY_TYPES.KYC,
          entityId: userId,
          previousStatus: `Level ${previousKycLevel}`,
          newStatus: `Level ${kycLevel}`,
          reason,
          metadata: {
            kycStatus: user.kycStatus,
            ...metadata
          }
        }, this.context)
      }

      return { success: true, user }
    } catch (error) {
      throw new APIError(error)
    }
  }
} 