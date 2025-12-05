'use strict'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
export default class Tip extends ModelBase {
  static model = 'tip'

  static table = 'tips'

  static options = {
    name: {
      singular: 'tip',
      plural: 'tips'
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
    recipientId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }

  static associate (models) {
    Tip.belongsTo(models.user, { foreignKey: 'userId', as: 'sender' })
    Tip.belongsTo(models.user, { foreignKey: 'recipientId', as: 'recipient' })
    Tip.hasMany(models.message, { foreignKey: 'tipId' })
    super.associate()
  }
}
