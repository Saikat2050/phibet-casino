'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('casino_transactions', 'index_transaction_round_id_for_casino_transactions')
    await queryInterface.sequelize.query('CREATE INDEX index_round_id_for_casino_transactions ON casino_transactions (round_id)')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE INDEX index_transaction_round_id_for_casino_transactions ON casino_transactions (transaction_id, round_id)')
    await queryInterface.removeIndex('casino_transactions', 'index_round_id_for_casino_transactions')
  }
}
