'use strict'

module.exports = (sequelize, DataTypes) => {
  const WheelDivisionConfiguration = sequelize.define(
    'WheelDivisionConfiguration',
    {
      wheelDivisionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      sc: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      gc: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      isAllow: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      playerLimit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'wheel_division_configuration',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  return WheelDivisionConfiguration
}
