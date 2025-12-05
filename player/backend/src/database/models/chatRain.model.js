'use strict'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
export default class ChatRain extends ModelBase {
  static model = 'chatRain'

  static table = 'chat_rains'

  static options = {
    name: {
      singular: 'chat_rain',
      plural: 'chat_rains'
    }
  }

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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    prizeMoney: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      field: 'prize_money'
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'closed_at'
    },
    criteria: {
      type: DataTypes.JSONB,
      allowNull: true,
      default: {}
    },
    chatGroupId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'chat_group_id'
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
      field: 'is_closed'
    },
    playersCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'players_count'
    },
    adminId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }

  static associate (models) {
    ChatRain.belongsTo(models.currency, { foreignKey: 'currencyId' })
    ChatRain.belongsTo(models.chatGroup, { foreignKey: 'chatGroupId' })
    ChatRain.belongsTo(models.adminUser, { foreignKey: 'adminId' })
    super.associate()
  }
}
