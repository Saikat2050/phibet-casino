'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE INDEX index_updated_at_transactions ON transactions (updated_at)')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('transactions', 'index_updated_at_transactions')
  }
}
