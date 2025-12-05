'use strict'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'
import { SETTING_DATA_TYPES } from '@src/utils/constants/public.constants.utils'

const defaultSettings = [{
  key: SETTING_KEYS.DEPOSIT_KYC_REQUIRED,
  value: 'true',
  data_type: SETTING_DATA_TYPES.BOOLEAN,
  description: 'If users are required kyc for purchase'
}, {
  key: SETTING_KEYS.DEPOSIT_PHONE_REQUIRED,
  value: 'true',
  data_type: SETTING_DATA_TYPES.BOOLEAN,
  description: 'If users are required phone verification for purchase'
}, {
  key: SETTING_KEYS.DEPOSIT_PROFILE_REQUIRED,
  value: 'true',
  data_type: SETTING_DATA_TYPES.BOOLEAN,
  description: 'If users are required profile completion for purchase'
}, {
  key: SETTING_KEYS.WITHDRAW_KYC_REQUIRED,
  value: 'true',
  data_type: SETTING_DATA_TYPES.BOOLEAN,
  description: 'If users are required kyc for redeem'
}, {
  key: SETTING_KEYS.WITHDRAW_PHONE_REQUIRED,
  value: 'true',
  data_type: SETTING_DATA_TYPES.BOOLEAN,
  description: 'If users are required phone verification for redeem'
}, {
  key: SETTING_KEYS.WITHDRAW_PROFILE_REQUIRED,
  value: 'true',
  data_type: SETTING_DATA_TYPES.BOOLEAN,
  description: 'If users are required profile completion for redeem'
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
