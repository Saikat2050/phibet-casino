'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.addColumn('users', 'affiliate_id', {
        type: DataTypes.STRING,
        allowNull: true,
        fieldName: 'affiliateId',
        _modelAttribute: true,
        field: 'affiliate_id'
      }),

      queryInterface.addColumn('users', 'affiliate_code', {
        type: DataTypes.STRING,
        allowNull: true,
        fieldName: 'affiliateCode',
        _modelAttribute: true,
        field: 'affiliate_code'
      }),

      queryInterface.removeConstraint('casino_transactions', 'casino_transactions_previous_transaction_id_key')
    ])
  },

  async down (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.removeColumn('users', 'affiliate_id'),
      queryInterface.removeColumn('users', 'affiliate_code')
    ])
  }
}
