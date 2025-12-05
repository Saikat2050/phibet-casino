import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Bonus extends ModelBase {
  static model = 'bonus'

  static table = 'bonus'

  static options = {
    name: {
      singular: 'bonus',
      plural: 'bonuses'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    bonusType: {
      type: DataTypes.ENUM(Object.values(BONUS_TYPES)),
      allowNull: false
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: true
    },
    validTo: {
      type: DataTypes.DATE,
      allowNull: true
    },
    daysToClear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    validOnDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Represented by binary string of 7 bits, each bit reprents a week day starting from monday'
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    visibleInPromotions: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    claimedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    termAndCondition: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    promotionTitle: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tagIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
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
    Bonus.hasMany(models.bonusCurrency, { foreignKey: 'bonusId', onDelete: 'cascade' })
    Bonus.hasMany(models.userBonus, { foreignKey: 'bonusId', onDelete: 'cascade' })
    super.associate()
  }
}
