'use strict'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, DataTypes) {
  await queryInterface.bulkInsert('admin_roles', [{
    name: 'Superadmin',
    level: 1,
    created_at: new Date(),
    updated_at: new Date()
  }, {
    name: 'Manager',
    level: 2,
    created_at: new Date(),
    updated_at: new Date()
  }, {
    name: 'Support',
    level: 3,
    created_at: new Date(),
    updated_at: new Date()
  }])
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, DataTypes) {
  await queryInterface.bulkDelete('admin_roles')
}

export { up, down }
