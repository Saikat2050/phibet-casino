'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('transactions', 'amount', {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('transactions', 'amount')
  }
}
