'use strict'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, DataTypes) {
  await queryInterface.bulkInsert('casino_categories', [{
    unique_id: 0,
    name: JSON.stringify({
      EN: 'default'
    }),
    icon_url: '',
    is_active: false,
    is_default: true,
    created_at: new Date(),
    updated_at: new Date()
  }])
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, DataTypes) {
  await queryInterface.sequelize.query('DELETE FROM casino_categories WHERE unique_id = \'0\';')
}
export { down, up }
