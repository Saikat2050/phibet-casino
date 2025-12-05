'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TYPE "enum_users_kyc_status" ADD VALUE IF NOT EXISTS \'CREATED\'')
    await queryInterface.sequelize.query('ALTER TYPE "enum_users_kyc_status" ADD VALUE IF NOT EXISTS \'ACTIVATED\'')
    await queryInterface.sequelize.query('ALTER TYPE "enum_users_kyc_status" ADD VALUE IF NOT EXISTS \'PROCESSING\'')
    await queryInterface.sequelize.query('ALTER TYPE "enum_users_kyc_status" ADD VALUE IF NOT EXISTS \'COMPLETE\'')
    await queryInterface.sequelize.query('ALTER TYPE "enum_users_kyc_status" ADD VALUE IF NOT EXISTS \'FAILED\'')
    await queryInterface.sequelize.query('ALTER TYPE "enum_users_kyc_status" ADD VALUE IF NOT EXISTS \'ARCHIVED\'')
  },

  down: async (queryInterface, Sequelize) => {
  }
}
