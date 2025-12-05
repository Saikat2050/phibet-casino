'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.addColumn('game_report_aggregates', 'total_bet_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'totalBetCount',
        _modelAttribute: true,
        field: 'total_bet_count'
      }),

      queryInterface.addColumn('game_report_aggregates', 'total_win_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'totalWinCount',
        _modelAttribute: true,
        field: 'total_win_count'
      }),

      queryInterface.addColumn('game_report_aggregates', 'total_bet_rollback_amount', {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        fieldName: 'totalBetRollbackAmount',
        _modelAttribute: true,
        field: 'total_bet_rollback_amount'
      }),

      queryInterface.addColumn('game_report_aggregates', 'total_bet_rollback_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'totalBetRollbackCount',
        _modelAttribute: true,
        field: 'total_bet_rollback_count'
      }),

      queryInterface.addColumn('game_report_aggregates', 'total_win_rollback_amount', {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        fieldName: 'totalWinRollbackAmount',
        _modelAttribute: true,
        field: 'total_win_rollback_amount'
      }),

      queryInterface.addColumn('game_report_aggregates', 'total_win_rollback_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'totalWinRollbackCount',
        _modelAttribute: true,
        field: 'total_win_rollback_count'
      }),

      queryInterface.addColumn('player_report_aggregates', 'sc_casino_wins_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'scCasinoWinsCount',
        _modelAttribute: true,
        field: 'sc_casino_wins_count'
      }),

      queryInterface.addColumn('player_report_aggregates', 'gc_casino_wins_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'gcCasinoWinsCount',
        _modelAttribute: true,
        field: 'gc_casino_wins_count'
      }),

      queryInterface.addColumn('player_report_aggregates', 'gc_casino_bet_rollback_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'gcCasinoBetRollbackCount',
        _modelAttribute: true,
        field: 'gc_casino_bet_rollback_count'
      }),

      queryInterface.addColumn('player_report_aggregates', 'sc_casino_bet_rollback_count', {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: false,
        fieldName: 'scCasinoBetRollbackCount',
        _modelAttribute: true,
        field: 'sc_casino_bet_rollback_count'
      }),

      queryInterface.addColumn('player_report_aggregates', 'gc_casino_win_rollback_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'gcCasinoWinRollbackCount',
        _modelAttribute: true,
        field: 'gc_casino_win_rollback_count'
      }),

      queryInterface.addColumn('player_report_aggregates', 'sc_casino_win_rollback_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'scCasinoWinRollbackCount',
        _modelAttribute: true,
        field: 'sc_casino_win_rollback_count'
      }),

      queryInterface.addColumn('player_report_aggregates', 'gc_purchases_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'gcPurchasesCount',
        _modelAttribute: true,
        field: 'gc_purchases_count'
      }),

      queryInterface.addColumn('player_report_aggregates', 'sc_purchases_count', {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        fieldName: 'scPurchasesCount',
        _modelAttribute: true,
        field: 'sc_purchases_count'
      }),

      queryInterface.addColumn('player_report_aggregates', 'sc_rewards_count', {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        fieldName: 'scRewardsCount',
        _modelAttribute: true,
        field: 'sc_rewards_count'
      }),

      queryInterface.addColumn('player_report_aggregates', 'gc_rewards_count', {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        fieldName: 'gcRewardsCount',
        _modelAttribute: true,
        field: 'gc_rewards_count'
      }),

      queryInterface.addColumn('player_report_aggregates', 'redeem_rejected_count', {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        fieldName: 'redeemRejectedCount',
        _modelAttribute: true,
        field: 'redeem_rejected_count'
      }),

      queryInterface.addColumn('player_report_aggregates', 'redeem_failed_count', {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        fieldName: 'redeemFailedCount',
        _modelAttribute: true,
        field: 'redeem_failed_count'
      }),

      queryInterface.addColumn('player_report_aggregates', 'redeem_completed_count', {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        fieldName: 'redeemCompletedCount',
        _modelAttribute: true,
        field: 'redeem_completed_count'
      })

    ])
  },

  async down (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.removeColumn('game_report_aggregates', 'total_bet_count'),
      queryInterface.removeColumn('game_report_aggregates', 'total_win_count'),
      queryInterface.removeColumn('game_report_aggregates', 'total_bet_rollback_amount'),
      queryInterface.removeColumn('game_report_aggregates', 'total_bet_rollback_count'),
      queryInterface.removeColumn('game_report_aggregates', 'total_win_rollback_amount'),
      queryInterface.removeColumn('game_report_aggregates', 'total_win_rollback_count'),
      queryInterface.removeColumn('player_report_aggregates', 'sc_casino_wins_count'),
      queryInterface.removeColumn('player_report_aggregates', 'gc_casino_wins_count'),
      queryInterface.removeColumn('player_report_aggregates', 'gc_casino_bet_rollback_count'),
      queryInterface.removeColumn('player_report_aggregates', 'sc_casino_bet_rollback_count'),
      queryInterface.removeColumn('player_report_aggregates', 'sc_casino_win_rollback_count'),
      queryInterface.removeColumn('player_report_aggregates', 'gc_casino_win_rollback_count'),
      queryInterface.removeColumn('player_report_aggregates', 'gc_purchases_count'),
      queryInterface.removeColumn('player_report_aggregates', 'sc_purchases_count'),
      queryInterface.removeColumn('player_report_aggregates', 'sc_rewards_count'),
      queryInterface.removeColumn('player_report_aggregates', 'gc_rewards_count'),
      queryInterface.removeColumn('player_report_aggregates', 'redeem_rejected_count'),
      queryInterface.removeColumn('player_report_aggregates', 'redeem_failed_count'),
      queryInterface.removeColumn('player_report_aggregates', 'redeem_completed_count')
    ])
  }
}
