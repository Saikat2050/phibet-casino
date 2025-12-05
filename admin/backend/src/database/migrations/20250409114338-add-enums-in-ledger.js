'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS \'chatRainGrabGc\'')
    await queryInterface.sequelize.query('ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS \'chatRainGrabBsc\'')
    await queryInterface.sequelize.query('ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS \'giveTipGc\'')
    await queryInterface.sequelize.query('ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS \'giveTipBsc\'')
    await queryInterface.sequelize.query('ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS \'receiveTipBsc\'')
    await queryInterface.sequelize.query('ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS \'receiveTipGc\'')
  },

  down: async (queryInterface, Sequelize) => {
  }
}
