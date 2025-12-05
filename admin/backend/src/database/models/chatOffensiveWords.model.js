import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class ChatOffensiveWord extends ModelBase {
  static model = 'chatOffensiveWord'

  static table = 'chat_offensive_words'

  static options = {
    name: {
      singular: 'chat_offensive_word',
      plural: 'chat_offensive_words'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    words: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
    super.associate(models)
  }
}
