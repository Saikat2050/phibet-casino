'use strict'
import { TYPE } from '../../utils/constants/constant'

module.exports = (sequelize, DataTypes) => {
  const Currency = sequelize.define('Currency', {
    currencyId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: TYPE.FIAT_ID
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    exchangeRate: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    loyaltyPoint: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'currencies',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  return Currency
}
