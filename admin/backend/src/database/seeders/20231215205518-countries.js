'use strict'
import countryCodesToCountries from '@src/database/models/countryCodesToCountries'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, DataTypes) {
  queryInterface.bulkInsert('countries', Object.keys(countryCodesToCountries).map(countryCode => {
    return {
      code: countryCode,
      name: countryCodesToCountries[countryCode],
      created_at: new Date(),
      updated_at: new Date()
    }
  }))
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, DataTypes) {
  await queryInterface.bulkDelete('wallets')
}
export { down, up }
