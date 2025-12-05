'use strict'

import { BANNER_TYPES } from '@src/utils/constants/public.constants.utils'

/** @type {import('sequelize-cli').Migration} */

async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('banners', [{
    type: BANNER_TYPES.HOME,
    created_at: new Date(),
    updated_at: new Date(),
    image_url: '[]'
  }, {
    type: BANNER_TYPES.CASINO,
    created_at: new Date(),
    updated_at: new Date(),
    image_url: '[]'
  }, {
    type: BANNER_TYPES.LOYALITY,
    created_at: new Date(),
    updated_at: new Date(),
    image_url: '[]'
  }, {
    type: BANNER_TYPES.PROMOTIONS,
    created_at: new Date(),
    updated_at: new Date(),
    image_url: '[]'
  }])
}

async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('banners')
}

export { down, up }
