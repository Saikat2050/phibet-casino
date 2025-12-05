'use strict'

module.exports = function (sequelize, DataTypes) {
  const Tier = sequelize.define(
    'Tier',
    {
      tierId: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      requiredXp: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: '1 XP = 1 SC & 1 XP = 10,000 GC coins'
      },
      bonusGc: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      bonusSc: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      weeklyBonusPercentage: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
      },
      monthlyBonusPercentage: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
      },
      isWeekelyBonusActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      isMonthlyBonusActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      }
    },
    {
      sequelize,
      tableName: 'tiers',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  Tier.associate = function (model) {
    Tier.hasMany(model.UserTier, {
      foreignKey: 'tierId',
      constraints: null
    })
  }

  return Tier
}
