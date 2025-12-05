'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE INDEX index_transaction_id_for_casino_transactions ON casino_transactions (transaction_id)')
    await queryInterface.sequelize.query('CREATE INDEX index_user_and_round_id_for_casino_transaction ON casino_transactions (user_id, round_id)')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('casino_transactions', 'index_transaction_id_for_casino_transactions')
    await queryInterface.removeIndex('casino_transactions', 'index_user_and_round_id_for_casino_transaction')
  }
}
