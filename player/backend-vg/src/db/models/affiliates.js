'use strict'
module.exports = function (sequelize, DataTypes) {
  const Affiliate = sequelize.define(
    'Affiliate',
    {
      affiliateId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      affiliateCode: {
        type: DataTypes.UUID,
        allowNull: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      phoneCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dateOfBirth: {
        type: DataTypes.STRING,
        allowNull: true
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true
      },
      addressLine_1: {
        type: DataTypes.STRING,
        allowNull: true
      },
      addressLine_2: {
        type: DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true
      },
      zipCode: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true
      },
      affiliate_status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
      },
      trafficSource: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      plan: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      isTermsAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      preferredContact: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isPhoneVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      emailToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      permission: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      roleId: {
        type: DataTypes.INTEGER
      },
      newPasswordKey: {
        type: DataTypes.STRING,
        allowNull: true
      },
      newPasswordRequested: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'affiliates',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )
  Affiliate.associate = function (model) {
    Affiliate.hasMany(model.User, {
      as: 'users',
      foreignKey: 'affiliateId',
      onDelete: 'cascade'
    })
    Affiliate.belongsTo(model.AdminRole, {
      foreignKey: 'roleId',
      as: 'role'
    })
  }
  return Affiliate
}
