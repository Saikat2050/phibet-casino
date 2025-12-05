'use strict'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
export default class OffensiveWord extends ModelBase {
  static model = 'offensiveWord'

  static table = 'offensive_words'

  static options = {
    name: {
      singular: 'offensive_word',
      plural: 'offensive_words'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    word: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }
}
