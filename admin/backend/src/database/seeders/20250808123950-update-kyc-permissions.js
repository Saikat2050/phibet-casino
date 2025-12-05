'use strict'
import { APPLICATION_PERMISSION } from '@src/utils/constants/permission.constant'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, DataTypes) {
  // Update all existing admin permissions to include the updated APPLICATION_PERMISSION
  // which now includes the KYC permissions
  await queryInterface.sequelize.query(`
    UPDATE permissions 
    SET permission = '${JSON.stringify(APPLICATION_PERMISSION)}',
        updated_at = NOW()
    WHERE admin_user_id IN (
      SELECT id FROM admin_users WHERE admin_role_id = '1'
    );`
  )

  console.log('✅ Updated admin permissions to include KYC CRUD permissions')
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, DataTypes) {
  // In case of rollback, we would need to remove KYC permissions
  // But since this is an additive change, we'll leave it as is
  console.log('⚠️  Rollback: KYC permissions remain in place')
}

export { down, up }
