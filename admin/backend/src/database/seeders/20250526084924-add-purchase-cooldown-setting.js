'use strict';

const { SETTING_KEYS } = require('@src/utils/constants/app.constants');
const { SETTING_DATA_TYPES } = require('@src/utils/constants/public.constants.utils');

const setting = {
  key: SETTING_KEYS.PURCHASE_COOLDOWN,
  value: '5',
  data_type: SETTING_DATA_TYPES.NUMBER,
  description: 'Cooldown period after purchase (In Minutes)',
};

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('settings', [{
    ...setting,
    created_at: new Date(),
    updated_at: new Date(),
  }]);
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('settings', {
    key: setting.key,
  });
}

module.exports = { up, down };
