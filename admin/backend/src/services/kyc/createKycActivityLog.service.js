import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { DOCUMENT_STATUS, KYC_STATUS } from '@src/utils/constants/public.constants.utils'


const statusEnum = [...new Set([
  ...Object.values(KYC_STATUS),
  ...Object.values(DOCUMENT_STATUS),
  null
])]
const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'number' },
    adminUserId: { type: ['number', 'null'] },
    action: { type: 'string' },
    entityType: { type: 'string' },
    entityId: { type: ['number', 'null'] },
    previousStatus: {
      type: ['string', 'null'],
      enum: statusEnum
    },
    newStatus: {
      type: ['string', 'null'],
      enum: statusEnum
    },   
    reason: { type: ['string', 'null'] },
    metadata: { type: 'object' },
    ipAddress: { type: ['string', 'null'] },
    userAgent: { type: ['string', 'null'] }
  },
  required: ['userId', 'action', 'entityType']
})

export class CreateKycActivityLogService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const {
      userId,
      adminUserId,
      action,
      entityType,
      entityId,
      previousStatus,
      newStatus,
      reason,
      metadata = {},
      ipAddress,
      userAgent
    } = this.args

    try {
      const activityLog = await sequelize.models.kycActivityLog.create({
        userId,
        adminUserId,
        action,
        entityType,
        entityId,
        previousStatus,
        newStatus,
        reason,
        metadata,
        ipAddress,
        userAgent
      }, { transaction })

      return { success: true, activityLog }
    } catch (error) {
      throw new APIError(error)
    }
  }
} 