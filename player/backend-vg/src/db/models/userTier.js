'use strict'

module.exports = function (sequelize, DataTypes) {
  const UserTier = sequelize.define(
    'UserTier',
    {
      userTierId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      tierId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      maxLevel: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      scSpend: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
      },
      gcSpend: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      tableName: 'users_tiers',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  UserTier.associate = function (model) {
    UserTier.belongsTo(model.Tier, {
      foreignKey: 'tierId',
      constraints: null
    })
    UserTier.belongsTo(model.User, {
      foreignKey: 'userId',
      constraints: null
    })
  }

  return UserTier
}
