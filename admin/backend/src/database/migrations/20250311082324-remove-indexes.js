'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('ledgers', 'ledgers_transaction_type')
    await queryInterface.removeIndex('ledgers', 'idx_ledgers_from_wallet_id')
    await queryInterface.removeIndex('ledgers', 'idx_ledgers_to_wallet_id')
    await queryInterface.removeIndex('casino_transactions', 'casino_transactions_user_id_created_at')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE INDEX ledgers_transaction_type ON ledgers (transaction_type)')
    await queryInterface.sequelize.query('CREATE INDEX idx_ledgers_from_wallet_id ON ledgers (from_walle_id)')
    await queryInterface.sequelize.query('CREATE INDEX casino_transactions_user_id_created_at ON casino_transactions (user_id, created_at)')
    await queryInterface.sequelize.query('CREATE INDEX idx_ledgers_to_wallet_id ON ledgers (to_wallet_id)')
  }
}
