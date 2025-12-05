'use strict'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
export default class ChatRule extends ModelBase {
  static model = 'chatRule'

  static table = 'chat_rules'

  static options = {
    name: {
      singular: 'chat_rule',
      plural: 'chat_rules'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    rules:{
      type: DataTypes.TEXT,
      allowNull: true
    }
  }
}
