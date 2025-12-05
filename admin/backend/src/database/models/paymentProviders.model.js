import { PAYMENT_PROVIDER_CATEGORY } from '@src/utils/constants/payment.constants'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class PaymentProvider extends ModelBase {
  static model = 'paymentProvider'

  static table = 'payment_providers'

  static options = {
    name: {
      singular: 'payment_provider',
      plural: 'payment_providers'
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
      type: DataTypes.JSONB,
      allowNull: true
    },
    aggregator: {
      type: DataTypes.STRING,
      allowNull: true
    },
    depositDescription: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    withdrawDescription: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    depositImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    withdrawImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    depositKycRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    withdrawKycRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    category: {
      type: DataTypes.ENUM(Object.values(PAYMENT_PROVIDER_CATEGORY)),
      allowNull: false,
      defaultValue: PAYMENT_PROVIDER_CATEGORY.INSTANT_BANKING
    },
    depositAllowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    withdrawAllowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    depositProfileRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    withdrawProfileRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    depositPhoneRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    withdrawPhoneRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    minWithdraw: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    maxWithdraw: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    withdrawBankRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    withdrawCardRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }

  static associate (models) {
    PaymentProvider.hasMany(models.transaction, { foreignKey: 'paymentProviderId', onDelete: 'cascade' })
    super.associate()
  }
}
