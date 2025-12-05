'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('game_report_aggregates', {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        fieldName: 'id',
        _modelAttribute: true,
        field: 'id'
      },
      fromDate: {
        allowNull: false,
        type: DataTypes.DATE,
        fieldName: 'fromDate',
        _modelAttribute: true,
        field: 'from_date',
        comment: 'Start of the 15-minute interval'
      },
      tillDate: {
        allowNull: false,
        type: DataTypes.DATE,
        fieldName: 'tillDate',
        _modelAttribute: true,
        field: 'till_date',
        comment: 'End of the 15-minute interval'
      },
      gameId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        fieldName: 'gameId',
        _modelAttribute: true,
        field: 'game_id',
        comment: 'Game ID'
      },
      providerId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        fieldName: 'providerId',
        _modelAttribute: true,
        field: 'provider_id',
        comment: 'Provider ID'
      },
      currencyId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        fieldName: 'currencyId',
        _modelAttribute: true,
        field: 'currency_id',
        comment: 'Currency ID'
      },
      totalBetAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        fieldName: 'totalBetAmount',
        _modelAttribute: true,
        field: 'total_bet_amount',
        comment: 'Cumulative bet amount'
      },
      totalWinAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        fieldName: 'totalWinAmount',
        _modelAttribute: true,
        field: 'total_win_amount',
        comment: 'Cumulative win amount'
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

    // unique constraint
    await queryInterface.addConstraint('game_report_aggregates', {
      fields: ['from_date', 'game_id', 'provider_id', 'currency_id'],
      type: 'unique',
      name: 'unique_from_date_game_provider_currency'
    })

    // composite index
    await queryInterface.addIndex('game_report_aggregates',
      ['from_date', 'till_date', 'currency_id', 'provider_id', 'game_id'],
      {
        name: 'idx_game_report_aggregates_composite'
      })
  },

  down: async (queryInterface, _) => {
    await queryInterface.removeIndex('game_report_aggregates', 'idx_game_report_aggregates_composite')
    await queryInterface.dropTable('game_report_aggregates', { schema: 'public' })
  }
}
