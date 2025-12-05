'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('payment_providers', 'withdraw_bank_required', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      fieldName: 'withdrawBankRequired',
      _modelAttribute: true,
      field: 'withdraw_bank_required',
      defaultValue: true
    })

    await queryInterface.addColumn('payment_providers', 'withdraw_card_required', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      fieldName: 'withdrawCardRequired',
      _modelAttribute: true,
      field: 'withdraw_card_required',
      defaultValue: true
    })

    await queryInterface.removeColumn('payment_providers', 'withdraw_methods')
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('payment_providers', 'withdraw_bank_required')
    await queryInterface.removeColumn('payment_providers', 'withdraw_card_required')
  }
}
