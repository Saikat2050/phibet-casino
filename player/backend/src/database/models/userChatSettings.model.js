import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class UserChatSetting extends ModelBase {
  static model = 'userChatSetting'

  static table = 'user_chat_settings'

  static options = {
    name: {
      singular: 'user_chat_setting',
      plural: 'user_chat_settings'
    }
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
      allowNull: false
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false
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
    UserChatSetting.belongsTo(models.user, { foreignKey: 'userId', onDelete: 'cascade' })
    super.associate()
  }
}
