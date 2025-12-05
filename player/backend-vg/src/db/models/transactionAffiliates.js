'use strict'

module.exports = function (sequelize, DataTypes) {
  const TransactionAffiliate = sequelize.define('TransactionAffiliate', {
    transactionAffiliateId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    affiliateId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    currencyCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    adminUserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paymentDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'transaction_affiliates',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  TransactionAffiliate.associate = function (model) {
  }

  return TransactionAffiliate
}
