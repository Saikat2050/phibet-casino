'use strict'
import { TRANSACTION_STATUS } from '../../utils/constants/constant'

module.exports = (sequelize, DataTypes) => {
  const CasinoTransaction = sequelize.define(
    'CasinoTransaction',
    {
      casinoTransactionId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      walletId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      gameIdentifier: {
        type: DataTypes.STRING,
        allowNull: true
      },
      gameId: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'game round id'
      },
      actionType: {
        // bet, win, cancel
        type: DataTypes.STRING,
        allowNull: false
      },
      actionId: {
        //  DEBIT: '0', CREDIT: '1', CANCEL: '2'
        type: DataTypes.STRING,
        allowNull: false
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: TRANSACTION_STATUS.PENDING
      },
      currencyCode: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      amountType: {
        // 0 = gc, 1 = sc, 2 - gc + sc
        type: DataTypes.INTEGER,
        allowNull: true
      },
      beforeBalance: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      afterBalance: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      elasticUpdated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isSticky: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      userBonusId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      roundId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      roundStatus: {
        // false = round open ,  true = round close
        type: DataTypes.BOOLEAN,
        default: false,
        allowNull: true
      },
      device: {
        type: DataTypes.STRING,
        allowNull: true
      },
      sc: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      gc: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {
          psc: 0,
          bsc: 0,
          wsc: 0
        }
      },
      tournamentId: {
        type: DataTypes.INTEGER,
        field: 'tournamentId',
        allowNull: true
      },
      sessionId: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'session_id'
      }
    },
    {
      sequelize,
      tableName: 'casino_transactions',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  CasinoTransaction.associate = function (models) {
    CasinoTransaction.belongsTo(models.Wallet, {
      foreignKey: 'walletId'
    })
    CasinoTransaction.belongsTo(models.User, {
      foreignKey: 'userId'
    })
    CasinoTransaction.belongsTo(models.MasterCasinoGame, {
      foreignKey: 'game_identifier',
      targetKey: 'identifier'
    })
  }

  return CasinoTransaction
}
