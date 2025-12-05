'use strict'
import { APPLICATION_PERMISSION } from '@src/utils/constants/permission.constant'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, DataTypes) {
  const [[superAdmin]] = await queryInterface.sequelize.query('SELECT * FROM admin_users;')
  await queryInterface.bulkInsert('permissions', [{
    admin_user_id: superAdmin.id,
    permission: JSON.stringify(APPLICATION_PERMISSION),
    created_at: new Date(),
    updated_at: new Date()
  }])
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, DataTypes) {
  await queryInterface.bulkDelete('permissions')
}

export { down, up }
