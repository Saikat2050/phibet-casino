'use strict'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'
import { SETTING_DATA_TYPES } from '@src/utils/constants/public.constants.utils'

const defaultSettings = [{
  key: SETTING_KEYS.FOOTER_LANDING_PAGE,
  value: '',
  data_type: SETTING_DATA_TYPES.STRING,
  description: 'Footer Content for Website on Landing Page'
}, {
  key: SETTING_KEYS.FOOTER_LOBBY_PAGE,
  value: '',
  data_type: SETTING_DATA_TYPES.STRING,
  description: 'Footer Content for Website on Lobby Page'
}
]

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('settings', defaultSettings.map(defaultSetting => {
    return {
      ...defaultSetting,
      created_at: new Date(),
      updated_at: new Date()
    }
  }))
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('settings')
}
export { down, up }
