'use strict'
import { TRANSACTION_STATUS } from '../../utils/constants/constant'

module.exports = function (sequelize, DataTypes) {
  const WithdrawRequest = sequelize.define('WithdrawRequest', {
    withdrawRequestId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: TRANSACTION_STATUS.PENDING
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: DataTypes.UUIDV4
    },
    actionableEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    actionableId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    actionedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paymentProvider: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'withdraw_requests',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  WithdrawRequest.associate = function (model) {
    WithdrawRequest.belongsTo(model.User, { foreignKey: 'userId' })
    WithdrawRequest.hasOne(model.TransactionBanking, {
      as: 'transactionBankings',
      foreignKey: 'withdrawRequestId',
      onDelete: 'cascade'
    })
  }
  return WithdrawRequest
}
