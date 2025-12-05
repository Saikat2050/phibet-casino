'use strict'
import ModelBase from './modelBase.model'
import { DataTypes } from 'sequelize'
export default class UserChatGroup extends ModelBase {
  static model = 'userChatGroup'

  static table = 'user_chat_groups'

  static options = {
    name: {
      singular: 'user_chat_group',
      plural: 'user_chat_groups'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chatGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      default: true
    },
    bannedTill: {
      type: DataTypes.DATE,
      default: true
    }
  }

  static associate (models) {
    UserChatGroup.belongsTo(models.user, { foreignKey: 'userId' })
    UserChatGroup.belongsTo(models.chatGroup, { foreignKey: 'chatGroupId' })
    super.associate()
  }
}
