'use strict'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */
async function up (queryInterface, Sequelize) {
  await queryInterface.sequelize.query(`
  UPDATE casino_providers
  SET casino_aggregator_id = 2
  WHERE unique_id = 'ICONIC_21';
  `)
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, DataTypes) {
}

export { down, up }
