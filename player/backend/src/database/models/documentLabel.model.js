import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
import { KYC_LEVELS } from '@src/utils/constants/public.constants.utils'

export default class DocumentLabel extends ModelBase {
  static model = 'documentLabel'

  static table = 'document_labels'

  static options = {
    name: {
      singular: 'documentLabel',
      plural: 'documentLabels'
    }
  }

  static attributes = {
    id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    kycLevel: {
      type: DataTypes.ENUM(Object.values(KYC_LEVELS)),
      allowNull: false,
      defaultValue: KYC_LEVELS.LEVEL_3
    },
    // allowedFileTypes: {
    //   type: DataTypes.JSONB,
    //   allowNull: false,
    //   defaultValue: ['jpg', 'jpeg', 'png', 'pdf']
    // },
    // maxFileSize: {
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    //   defaultValue: 10485760 // 10MB
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
    DocumentLabel.hasMany(models.userDocument, { foreignKey: 'documentLabelId' })
    super.associate()
  }
}
