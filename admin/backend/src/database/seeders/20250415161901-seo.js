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

  const casinoCategories = await queryInterface.sequelize.query(
    'SELECT id, name, slug FROM casino_categories',
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  )

  casinoCategories.forEach(async (category) => {
    await queryInterface.sequelize.query(
      `UPDATE casino_categories
       SET slug = '${category.name.EN.replace(/\s+/g, '').toLowerCase()}'
       WHERE id = ${category.id}`,
      {
        type: queryInterface.sequelize.QueryTypes.UPDATE
      }
    )
  })
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, DataTypes) {
}

export { down, up }
