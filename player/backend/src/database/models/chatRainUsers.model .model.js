'use strict'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
export default class ChatRainUser extends ModelBase {
  static model = 'chatRainUser'

  static table = 'chat_rain_users'

  static options = {
    name: {
      singular: 'chat_rain_user',
      plural: 'chat_rain_users'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    chatRainId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'chat_rain_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'user_id'
    },
    winAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      field: 'win_amount'
    }
  }
}
