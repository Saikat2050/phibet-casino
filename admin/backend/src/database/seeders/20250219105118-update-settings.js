'use strict'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'
import { SETTING_DATA_TYPES } from '@src/utils/constants/public.constants.utils'

const defaultSettings = [{
  key: SETTING_KEYS.XP_REQUIREMENTS,
  value: 1,
  data_type: SETTING_DATA_TYPES.NUMBER,
  description: 'Constant for XP requirement by SC coin'
}, {
  key: SETTING_KEYS.GAME_PLAY_KYC_REQUIRED,
  value: 'false',
  data_type: SETTING_DATA_TYPES.BOOLEAN,
  description: 'If KYC is required for game play'
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
