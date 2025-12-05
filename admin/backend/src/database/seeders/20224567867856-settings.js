'use strict'
import { appConfig } from '@src/configs'
import { DEFAULT_REFERRAL, SETTING_KEYS } from '@src/utils/constants/app.constants'
import { SETTING_DATA_TYPES } from '@src/utils/constants/public.constants.utils'

const defaultSettings = [{
  key: SETTING_KEYS.MIN_STAKE_AMOUNT,
  value: '1',
  data_type: SETTING_DATA_TYPES.NUMBER,
  description: 'Minimal liability value required to place a bet'
}, {
  key: SETTING_KEYS.APPLICATION_NAME,
  value: 'ARC',
  data_type: SETTING_DATA_TYPES.STRING,
  description: 'Application name'
}, {
  key: SETTING_KEYS.MAINTENANCE,
  value: 'false',
  data_type: SETTING_DATA_TYPES.BOOLEAN,
  description: 'Value if the system is going in maintenance'
}, {
  key: SETTING_KEYS.CASINO,
  value: 'true',
  data_type: SETTING_DATA_TYPES.BOOLEAN,
  description: 'Value if the casino is enabled in the system'
}, {
  key: SETTING_KEYS.DEFAULT_SUPPORT,
  value: appConfig.superAdmin.email,
  data_type: SETTING_DATA_TYPES.STRING,
  description: 'Value for default support email'
}, {
  key: SETTING_KEYS.LOGO,
  value: '',
  data_type: SETTING_DATA_TYPES.STRING,
  description: 'Logo for the app'
}, {
  key: SETTING_KEYS.ADMIN_END_URL,
  value: 'http://localhost:3000',
  data_type: SETTING_DATA_TYPES.STRING,
  description: 'URL for the back office UI'
}, {
  key: SETTING_KEYS.USER_END_URL,
  value: appConfig.userFrontend.endpoint,
  data_type: SETTING_DATA_TYPES.STRING,
  description: 'URL for the user UI'
}, {
  key: SETTING_KEYS.GALLERY,
  value: '[]',
  data_type: SETTING_DATA_TYPES.JSON,
  description: 'Gallery images'
}, {
  key: SETTING_KEYS.REFERRAL,
  value: JSON.stringify(DEFAULT_REFERRAL),
  data_type: SETTING_DATA_TYPES.JSON,
  description: 'Referral Data'
},
{
  key: SETTING_KEYS.DEFAULT_CHAT_SETTINGS,
  value: '{"fontSize": 14,"displayGIF": "true","displayLevel": "false","notificationSound": "all"}',
  data_type: SETTING_DATA_TYPES.JSON,
  description: 'Default chat settings'
},
{
  key: SETTING_KEYS.CHAT_CONFIGURATION,
  value: '{"CHAT": "enable","SHARING": "enable"}',
  data_type: SETTING_DATA_TYPES.JSON,
  description: 'Default chat config'
},
{
  key: SETTING_KEYS.AMOE_ADDRESS,
  value: JSON.stringify({
    addressLine1: 'Sweepstakes Entry',
    addressLine2: '1234 Main St',
    city: 'Sweep City',
    state: 'SC',
    postalCode: '98765',
    country: 'US'
  }),
  data_type: SETTING_DATA_TYPES.JSON,
  description: 'Default amoe address config'
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
