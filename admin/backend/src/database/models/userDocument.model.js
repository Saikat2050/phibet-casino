import { DataTypes } from 'sequelize'
import { KYC_STATUS } from '@src/utils/constants/public.constants.utils'
import ModelBase from './modelBase.model'

export default class UserDocument extends ModelBase {
  static model = 'userDocument'

  static table = 'user_documents'

  static options = {
    name: {
      singular: 'userDocument',
      plural: 'userDocuments'
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
    documentLabelId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // originalFileName: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    fileUrl: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    // fileSize: {
    //   type: DataTypes.BIGINT,
    //   allowNull: false
    // },
    // mimeType: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    status: {
      type: DataTypes.ENUM(Object.values(KYC_STATUS)),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reviewedBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
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
    UserDocument.belongsTo(models.user, { foreignKey: 'userId' })
    UserDocument.belongsTo(models.documentLabel, { foreignKey: 'documentLabelId' })
    UserDocument.belongsTo(models.adminUser, { foreignKey: 'reviewedBy', as: 'reviewer' })
    super.associate()
  }
} 