'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS \'JackpotEntry\'')
    await queryInterface.sequelize.query('ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS \'JackpotWin\'')
  },

  down: async (queryInterface, Sequelize) => {
  }
}
