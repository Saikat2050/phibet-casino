import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class ChatSetting extends ModelBase {
  static model = 'chatSetting'

  static table = 'chat_settings'

  static options = {
    name: {
      singular: 'chat_setting',
      plural: 'chat_settings'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    options: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    value: {
      type: DataTypes.STRING(225),
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
    super.associate()
  }
}
