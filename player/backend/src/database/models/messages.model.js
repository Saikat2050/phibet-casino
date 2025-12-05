'use strict'
import { DataTypes } from 'sequelize'
import { MESSAGE_STATUS, MESSAGE_TYPE } from '@src/utils/constants/chat.constants'
import ModelBase from './modelBase.model'
export default class Message extends ModelBase {
  static model = 'message'

  static table = 'messages'

  static options = {
    name: {
      singular: 'message',
      plural: 'messages'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    actioneeId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    recipientId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    messageBinary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(Object.values(MESSAGE_STATUS)),
      allowNull: false,
      defaultValue: MESSAGE_STATUS.ACTIVE
    },
    isContainOffensiveWord: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_private'
    },
    messageType: {
      type: DataTypes.ENUM(Object.values(MESSAGE_TYPE)),
      default: MESSAGE_TYPE.MESSAGE,
      field: 'message_type'
    },
    replyMessageId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    rainId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    chatGroupId: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }

  static associate (models) {
    Message.belongsTo(models.user, { foreignKey: 'actioneeId', as: 'user' })
    Message.belongsTo(models.user, { foreignKey: 'recipientId', as: 'recipientUser' })
    Message.belongsTo(models.message, { foreignKey: 'replyMessageId', as: 'replyMessage' })
    Message.belongsTo(models.currency, { foreignKey: 'currencyId' })
    Message.belongsTo(models.chatGroup, { foreignKey: 'chatGroupId' })

    super.associate()
  }
}
