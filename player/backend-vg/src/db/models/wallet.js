'use strict'

module.exports = function (sequelize, DataTypes) {
  const Wallet = sequelize.define('Wallet', {
    walletId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    },
    currencyCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ownerType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    non_cash_amount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    },
    gcCoin: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    },
    scCoin: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        psc: 0,
        bsc: 0,
        wsc: 0
      }
    },
    vaultGcCoin: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    },
    vaultScCoin: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    totalScCoin: {
      type: DataTypes.VIRTUAL,
      get () {
        return Number((Math.round((parseFloat(Object.values(this.scCoin).reduce((sum, key) => sum + parseFloat(key), 0))) * 100) / 100).toFixed(2))
      }
    }
  }, {
    sequelize,
    tableName: 'wallets',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  Wallet.associate = function (model) {
    Wallet.hasMany(model.TransactionBanking, {
      as: 'transactionBankings',
      foreignKey: 'walletId',
      onDelete: 'cascade'
    })
    Wallet.belongsTo(model.User, {
      foreignKey: 'ownerId',
      constraints: false
    })
    Wallet.hasMany(model.CasinoTransaction, {
      as: 'casinoTransactions',
      foreignKey: 'walletId',
      onDelete: 'cascade'
    })
  }

  return Wallet
}
