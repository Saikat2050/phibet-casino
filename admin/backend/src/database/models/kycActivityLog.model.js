import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
import { DOCUMENT_STATUS, KYC_ACTIONS, KYC_STATUS } from '@src/utils/constants/public.constants.utils'

export default class KycActivityLog extends ModelBase {
  static model = 'kycActivityLog'

  static table = 'kyc_activity_logs'

  static options = {
    name: {
      singular: 'kycActivityLog',
      plural: 'kycActivityLogs'
    }
  }

  static attributes = {
    id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    adminUserId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    action: {
      type: DataTypes.ENUM(Object.values(KYC_ACTIONS)),
      allowNull: false
    },
    // entityType: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    // entityId: {
    //   type: DataTypes.BIGINT,
    //   allowNull: true
    // },
    previousStatus: {
      type: DataTypes.ENUM(...new Set([
        ...Object.values(KYC_STATUS),
        ...Object.values(DOCUMENT_STATUS)
      ])),
      allowNull: true
    },
    newStatus: {
      type: DataTypes.ENUM(...new Set([
        ...Object.values(KYC_STATUS),
        ...Object.values(DOCUMENT_STATUS)
      ])),
      allowNull: true
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
    // ipAddress: {
    //   type: DataTypes.STRING,
    //   allowNull: true
    // },
    // userAgent: {
    //   type: DataTypes.TEXT,
    //   allowNull: true
    // },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }

  static associate (models) {
    KycActivityLog.belongsTo(models.user, { foreignKey: 'userId' })
    KycActivityLog.belongsTo(models.adminUser, { foreignKey: 'adminUserId' })
    super.associate()
  }
} 