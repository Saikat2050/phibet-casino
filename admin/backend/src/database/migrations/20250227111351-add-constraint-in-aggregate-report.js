'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await Promise.all([

      queryInterface.removeConstraint('player_report_aggregates', 'unique_user_id_from_date_till_date'),
      queryInterface.removeConstraint('game_report_aggregates', 'unique_from_date_game_provider_currency'),
      await queryInterface.addConstraint('player_report_aggregates', {
        fields: ['user_id', 'from_date', 'till_date', 'is_internal'],
        type: 'unique',
        name: 'unique_constraint_player_report_aggregates'
      }),
      await queryInterface.addConstraint('game_report_aggregates', {
        fields: ['from_date', 'till_date', 'game_id', 'provider_id', 'currency_id', 'is_internal'],
        type: 'unique',
        name: 'unique_constraint_game_report_aggregates'
      }),
      await queryInterface.addConstraint('performance_report', {
        fields: ['from_date', 'to_date', 'is_internal'],
        type: 'unique',
        name: 'unique_constraint_performance_report'
      })
    ])
  },

  async down (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.removeConstraint('performance_report', 'unique_constraint_performance_report'),
      queryInterface.removeConstraint('game_report_aggregates', 'unique_constraint_game_report_aggregates'),
      queryInterface.removeConstraint('player_report_aggregates', 'unique_constraint_player_report_aggregates')
    ])
  }
}
