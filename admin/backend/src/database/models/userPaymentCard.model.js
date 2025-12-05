import { PAYMENT_CARD_TYPES } from '@src/utils/constants/public.constants.utils'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class UserPaymentCard extends ModelBase {
  static model = 'userPaymentCard'

  static table = 'user_payment_cards'

  static options = {
    name: {
      singular: 'userPaymentCard',
      plural: 'userPaymentCards'
    }
  }

  static jsonSchemaOptions = {
    exclude: ['cardNumber']
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    cardNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiryMonth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12
      }
    },
    expiryYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: new Date().getFullYear()
      }
    },
    cardHolderName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cardType: {
      type: DataTypes.ENUM(Object.values(PAYMENT_CARD_TYPES)),
      allowNull: false,
      defaultValue: PAYMENT_CARD_TYPES.OTHER
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    isCreditCard: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    moreDetails: {
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
    UserPaymentCard.belongsTo(models.user, { 
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    })
    super.associate()
  }
}