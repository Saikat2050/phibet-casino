import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class ChatDetail extends ModelBase {
  static model = 'chatDetail'

  static table = 'chat_details'

  static options = {
    name: {
      singular: 'chat_detail',
      plural: 'chat_details'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    receiver: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    groupId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isGif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isOffensive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    sender: {
      type: DataTypes.BIGINT,
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
    ChatDetail.belongsTo(models.user, {
      as: 'Sender',
      foreignKey: 'sender',
      onDelete: 'cascade'
    })

    ChatDetail.belongsTo(models.user, {
      as: 'Receiver',
      foreignKey: 'receiver',
      onDelete: 'set null'
    })

    ChatDetail.belongsTo(models.chatGroup, {
      as: 'Group',
      foreignKey: 'groupId',
      onDelete: 'set null'
    })

    super.associate()
  }
}
