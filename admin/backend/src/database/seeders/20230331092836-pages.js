'use strict'
import { getPages } from './pages'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, DataTypes) {
  let pages = await getPages()
  await queryInterface.bulkInsert('pages', pages.map(page => {
    return {
      ...page,
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
  await queryInterface.bulkDelete('pages')
}
export { down, up }
