'use strict'
import { APPLICATION_PERMISSION } from '@src/utils/constants/permission.constant'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, DataTypes) {
  await queryInterface.sequelize.query(`
    UPDATE permissions p
    SET permission = '${JSON.stringify(APPLICATION_PERMISSION)}'
    FROM admin_users au
    WHERE au.admin_role_id = '1';`
  )
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, DataTypes) {
}

export { down, up }
