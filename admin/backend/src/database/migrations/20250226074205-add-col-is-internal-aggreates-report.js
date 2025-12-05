'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.addColumn('performance_report', 'is_internal', {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        fieldName: 'isActive',
        _modelAttribute: true,
        field: 'is_active'
      }),

      queryInterface.addColumn('game_report_aggregates', 'is_internal', {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        fieldName: 'isActive',
        _modelAttribute: true,
        field: 'is_active'
      }),

      queryInterface.addColumn('player_report_aggregates', 'is_internal', {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        fieldName: 'isActive',
        _modelAttribute: true,
        field: 'is_active'
      }),

      queryInterface.removeConstraint('performance_report', 'unique_from_date')

    ])
  },

  async down (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.removeColumn('performance_report', 'is_internal'),
      queryInterface.removeColumn('game_report_aggregates', 'is_internal'),
      queryInterface.removeColumn('player_report_aggregates', 'is_internal')
    ])
  }
}
