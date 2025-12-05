'use strict'

module.exports = (sequelize, DataTypes) => {
  const PaymentProvider = sequelize.define('PaymentProvider', {
    paymentProviderId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    paymentProviderName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    depositAllowed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    withdrawAllowed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
      isCreditCardProvider: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'payment_providers',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  return PaymentProvider
}
