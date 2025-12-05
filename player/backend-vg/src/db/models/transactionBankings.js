'use strict'
import { TRANSACTION_STATUS } from '../../utils/constants/constant'

module.exports = (sequelize, DataTypes) => {
  const TransactionBanking = sequelize.define('TransactionBanking', {
    transactionBankingId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    actioneeType: {
      type: DataTypes.STRING
    },
    actioneeId: {
      type: DataTypes.INTEGER
    },
    actioneeEmail: {
      type: DataTypes.STRING
    },
    actioneeName: {
      type: DataTypes.STRING
    },
    walletId: {
      type: DataTypes.INTEGER
    },
    toWalletId: {
      type: DataTypes.INTEGER
    },
    fromWalletId: {
      type: DataTypes.INTEGER
    },
    withdrawRequestId: {
      type: DataTypes.INTEGER
    },
    currencyCode: {
      type: DataTypes.STRING
    },
    amount: {
      type: DataTypes.FLOAT
    },
    gcCoin: {
      type: DataTypes.DOUBLE
    },
    scCoin: {
      type: DataTypes.DOUBLE
    },
    beforeBalance: {
      type: DataTypes.JSONB
    },
    afterBalance: {
      type: DataTypes.JSONB
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: TRANSACTION_STATUS.PENDING
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    transactionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    transactionDateTime: {
      type: DataTypes.DATE
    },
    transactionType: {
      type: DataTypes.STRING
    },
    isSuccess: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    paymentTransactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    isFirstDeposit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    promocodeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'transaction_bankings',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  TransactionBanking.associate = function (models) {
    TransactionBanking.belongsTo(models.Wallet, {
      as: 'wallet',
      foreignKey: 'walletId'
    })
    TransactionBanking.belongsTo(models.User, {
      foreignKey: 'actioneeId',
      constraints: false,
      as: 'transactionUser'
    })
    TransactionBanking.belongsTo(models.Package, {
      foreignKey: 'packageId',
      constraints: false,
      as: 'package'
    })
    TransactionBanking.belongsTo(models.WithdrawRequest, {
      as: 'withdrawRequest',
      foreignKey: 'withdrawRequestId'
    })
  }

  return TransactionBanking
}
