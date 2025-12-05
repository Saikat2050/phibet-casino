'use strict'
module.exports = function (sequelize, DataTypes) {
  const PaymentMethod = sequelize.define('PaymentMethod', {
    paymentMethodId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    methodName: {
      type: DataTypes.STRING
    },
    paymentProviders: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    tableName: 'payment_methods',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  return PaymentMethod
}
