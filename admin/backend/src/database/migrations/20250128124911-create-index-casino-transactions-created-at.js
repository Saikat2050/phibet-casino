'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('casino_transactions', ['created_at'], {
      name: 'idx_casino_transactions_created_at'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('casino_transactions', 'idx_casino_transactions_created_at')
  }
}
