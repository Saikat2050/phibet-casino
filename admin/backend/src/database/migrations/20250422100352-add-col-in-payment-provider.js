'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('payment_providers', 'withdraw_methods', {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      fieldName: 'withdrawMethods',
      _modelAttribute: true,
      field: 'withdraw_methods'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('payment_providers', 'withdraw_methods')
  }
}
