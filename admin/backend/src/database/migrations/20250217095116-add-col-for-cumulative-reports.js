'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.addColumn('performance_report', 'sc_rewards', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'scRewards',
        _modelAttribute: true,
        field: 'sc_rewards'
      }),

      queryInterface.addColumn('performance_report', 'sc_rewards_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'scRewardsCount',
        _modelAttribute: true,
        field: 'sc_rewards_count'
      }),

      queryInterface.addColumn('performance_report', 'gc_rewards', {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        fieldName: 'gcRewards',
        _modelAttribute: true,
        field: 'gc_rewards'
      }),

      queryInterface.addColumn('performance_report', 'gc_rewards_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'gcRewardsCount',
        _modelAttribute: true,
        field: 'gc_rewards_count'
      })

    ])
  },

  async down (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.removeColumn('performance_report', 'sc_rewards'),
      queryInterface.removeColumn('performance_report', 'sc_rewards_count'),
      queryInterface.removeColumn('performance_report', 'gc_rewards'),
      queryInterface.removeColumn('performance_report', 'gc_rewards_count')
    ])
  }
}
