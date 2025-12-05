'use strict'
import { appConfig } from '@src/configs'
import bcrypt from 'bcrypt'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, DataTypes) {
  const password = await bcrypt.hash(Buffer.from(appConfig.superAdmin.password).toString('base64'), appConfig.bcrypt.salt)
  await queryInterface.bulkInsert('admin_users', [{
    password,
    is_active: true,
    email_verified: true,
    username: appConfig.superAdmin.username,
    email: appConfig.superAdmin.email,
    admin_role_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }])
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, DataTypes) {
  await queryInterface.bulkDelete('admin_users')
}

export { down, up }
