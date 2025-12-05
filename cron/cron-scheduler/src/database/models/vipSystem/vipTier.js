import { ModelBase } from '../modelBase'
import { DataTypes } from 'sequelize'

export default class VipTier extends ModelBase {
  static model = 'vipTier'

  static table = 'vip_tiers'

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    xpRequirement: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tierUpBonus: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    monthlyPercentage: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    weeklyPercentage: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    rakebackPercentage: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    cashbackMonthlyLimit: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    rakebackMonthlyLimit: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },

    issueSpinWheel: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    VipTier.hasMany(models.userVipTier, { foreignKey: 'vipLevelId' })
    super.associate()
  }
}
