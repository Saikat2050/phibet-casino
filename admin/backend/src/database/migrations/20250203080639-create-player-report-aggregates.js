'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('player_report_aggregates', {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        fieldName: 'id',
        _modelAttribute: true,
        field: 'id'
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        fieldName: 'userId',
        _modelAttribute: true,
        field: 'user_id'
      },
      fromDate: {
        allowNull: false,
        type: DataTypes.DATE,
        fieldName: 'fromDate',
        _modelAttribute: true,
        field: 'from_date'
      },
      tillDate: {
        allowNull: false,
        type: DataTypes.DATE,
        fieldName: 'tillDate',
        _modelAttribute: true,
        field: 'till_date'
      },
      gcStakedAmount: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'gcStakedAmount',
        _modelAttribute: true,
        field: 'gc_staked_amount'
      },
      gcBetCount: {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'gcBetCount',
        _modelAttribute: true,
        field: 'gc_bet_count'
      },
      scStakedAmount: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'scStakedAmount',
        _modelAttribute: true,
        field: 'sc_staked_amount'
      },
      scBetCount: {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'scBetCount',
        _modelAttribute: true,
        field: 'sc_bet_count'
      },
      scCasinoWins: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'scCasinoWins',
        _modelAttribute: true,
        field: 'sc_casino_wins'
      },
      gcCasinoWins: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'gcCasinoWins',
        _modelAttribute: true,
        field: 'gc_casino_wins'
      },
      gcCasinoBetRollback: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'gcCasinoBetRollback',
        _modelAttribute: true,
        field: 'gc_casino_bet_rollback'
      },
      scCasinoBetRollback: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'scCasinoBetRollback',
        _modelAttribute: true,
        field: 'sc_casino_bet_rollback'
      },
      gcCasinoWinRollback: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'gcCasinoWinRollback',
        _modelAttribute: true,
        field: 'gc_casino_win_rollback'
      },
      scCasinoWinRollback: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'scCasinoWinRollback',
        _modelAttribute: true,
        field: 'sc_casino_win_rollback'
      },
      gcPurchases: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'gcPurchases',
        _modelAttribute: true,
        field: 'gc_purchases'
      },
      scPurchases: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'scPurchases',
        _modelAttribute: true,
        field: 'sc_purchases'
      },
      scRewards: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'scRewards',
        _modelAttribute: true,
        field: 'sc_rewards'
      },
      gcRewards: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'gcRewards',
        _modelAttribute: true,
        field: 'gc_rewards'
      },
      redeemRejectedAmount: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'redeemRejectedAmount',
        _modelAttribute: true,
        field: 'redeem_rejected_amount'
      },
      redeemCompletedAmount: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'redeemCompletedAmount',
        _modelAttribute: true,
        field: 'redeem_completed_amount'
      },
      redeemFailedAmount: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'redeemFailedAmount',
        _modelAttribute: true,
        field: 'redeem_failed_amount'
      },
      netProfit: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        fieldName: 'netProfit',
        _modelAttribute: true,
        field: 'net_profit'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        fieldName: 'createdAt',
        _modelAttribute: true,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        fieldName: 'updatedAt',
        _modelAttribute: true,
        field: 'updated_at'
      }
    }, {
      schema: 'public',
      timestamps: true
    })

    await queryInterface.addIndex('player_report_aggregates', ['from_date', 'till_date'], {
      name: 'idx_player_report_aggregates_dates'
    })

    await queryInterface.addIndex('player_report_aggregates', ['user_id'], {
      name: 'idx_player_report_aggregates_userId'
    })

    // unique constraint
    await queryInterface.addConstraint('player_report_aggregates', {
      fields: ['user_id', 'from_date', 'till_date'],
      type: 'unique',
      name: 'unique_user_id_from_date_till_date'
    })
  },

  down: async (queryInterface, _) => {
    await queryInterface.removeIndex('player_report_aggregates', 'idx_player_report_aggregates_dates')
    await queryInterface.removeIndex('player_report_aggregates', 'idx_player_report_aggregates_userId')
    await queryInterface.dropTable('player_report_aggregates', { schema: 'public' })
  }
}
