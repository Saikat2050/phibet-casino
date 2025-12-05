'use strict'

import { APPLICATION_PERMISSION } from '@src/utils/constants/permission.constant'
import { BANNER_TYPES } from '@src/utils/constants/public.constants.utils'

/** @type {import('sequelize-cli').Migration} */

async function up (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('banners')

  await queryInterface.sequelize.query(`
    UPDATE permissions p
    SET permission = '${JSON.stringify(APPLICATION_PERMISSION)}'
    FROM admin_users au
    WHERE au.admin_role_id = '1';`
  )

  await queryInterface.bulkInsert('banners', [{
    type: BANNER_TYPES.HOME,
    created_at: new Date(),
    updated_at: new Date(),
    image_url: '[]',
    mobile_image_url: '[]'
  }, {
    type: BANNER_TYPES.STORE,
    created_at: new Date(),
    updated_at: new Date(),
    image_url: '[]',
    mobile_image_url: '[]'
  }, {
    type: BANNER_TYPES.PROMOTIONS,
    created_at: new Date(),
    updated_at: new Date(),
    image_url: '[]',
    mobile_image_url: '[]'
  }])
}

async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('banners')
}

export { down, up }
