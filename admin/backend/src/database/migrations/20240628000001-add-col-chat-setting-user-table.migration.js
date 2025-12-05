'use strict'

const tableName = 'users'
const schema = 'public'
module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn({ tableName, schema }, 'chat_settings', {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        FONT_SIZE: 14,
        DISPLAY_GIF: true,
        DISPLAY_LEVEL: true,
        NOTIFICATION_SOUND: 'all'
      }
    })
    await queryInterface.addColumn({ tableName, schema }, 'ranking_level', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5
    })
  },

  down: async (queryInterface, _) => {
    await queryInterface.removeColumn({ tableName, schema }, 'chat_settings')
    await queryInterface.removeColumn({ tableName, schema }, 'ranking_level')
  }
}
