import ModelBase from './modelBase.model'
import { DataTypes } from 'sequelize'

export default class UserVipTier extends ModelBase {
  static model = 'userVipTier'

  static table = 'user_vip_tiers'

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    vipLevelId: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    UserVipTier.belongsTo(models.vipTier, { foreignKey: 'vipLevelId', onDelete: 'cascade' })
    UserVipTier.belongsTo(models.user, { foreignKey: 'userId', onDelete: 'cascade' })
    super.associate()
  }
}
