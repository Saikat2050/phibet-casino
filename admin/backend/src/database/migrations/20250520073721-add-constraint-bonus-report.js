'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await Promise.all([
      await queryInterface.addConstraint('bonus_report', {
        fields: ['from_date', 'to_date', 'is_internal'],
        type: 'unique',
        name: 'unique_constraint_bonus_report'
      })
    ])
  },

  async down (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.removeConstraint('bonus_report', 'unique_constraint_bonus_report')
    ])
  }
}
