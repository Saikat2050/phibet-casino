'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('users', 'sc_waggered_amount', {
      type: DataTypes.DOUBLE,
      allowNull: true,
      fieldName: 'scWaggeredAmount',
      _modelAttribute: true,
      field: 'sc_waggered_amount'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('users', 'sc_waggered_amount')
  }
}
