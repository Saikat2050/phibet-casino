'use strict'
module.exports = (sequelize, DataTypes) => {
  const FraudLog = sequelize.define(
    'FraudLog',
    {
      fraudLogId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: true
      },
      seonId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      fraudScore: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      appliedRules: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'fraud_log',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  // define association here:

  return FraudLog
}
