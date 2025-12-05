'use strict'

// this migration is useed to add new enums
// while
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding new values to the ENUM type
    await queryInterface.sequelize.query('ALTER TYPE "enum_casino_transactions_status" ADD VALUE IF NOT EXISTS \'rollback\'')
  },

  down: async (queryInterface, Sequelize) => {
    // cant rollback this
  }
}
