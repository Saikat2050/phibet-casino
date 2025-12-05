'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.addColumn('wallets', 'vault_amount', {
        type: DataTypes.DOUBLE,
        allowNull: true,
        fieldName: 'vaultAmount',
        defaultValue: 0.0,
        _modelAttribute: true,
        field: 'vault_amount'
      }),
      queryInterface.sequelize.query('ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS \'vaultDeposit\''),
      queryInterface.sequelize.query('ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS \'vaultRedeem\'')
    ])
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('wallets', 'vault_amount')
  }
}
