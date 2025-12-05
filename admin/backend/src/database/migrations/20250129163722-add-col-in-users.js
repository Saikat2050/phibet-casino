'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('users', 'ssn', {
      type: DataTypes.STRING,
      allowNull: true,
      fieldName: 'ssn',
      _modelAttribute: true,
      field: 'ssn'
    })
    await queryInterface.addColumn('users', 'approvely_withdrawer_id', {
      type: DataTypes.STRING,
      allowNull: true,
      fieldName: 'approvelyWithdrawerId',
      _modelAttribute: true,
      field: 'approvely_withdrawer_id'
    })
    await queryInterface.addColumn('withdrawals', 'failed_transaction_id', {
      type: DataTypes.STRING,
      allowNull: true,
      fieldName: 'failedTransactionId',
      _modelAttribute: true,
      field: 'failed_transaction_id'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('users', 'ssn')
    await queryInterface.removeColumn('users', 'approvely_withdrawer_id')
    await queryInterface.removeColumn('withdrawals', 'failed_transaction_id')
  }
}
