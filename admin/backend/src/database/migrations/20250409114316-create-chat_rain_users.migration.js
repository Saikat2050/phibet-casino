'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('chat_rain_users', {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      chatRainId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'chat_rain_id',
        references: {
          model: {
            tableName: 'chat_rains',
            table: 'chat_rains',
            name: 'chatRain',
            schema: 'public',
            delimiter: '.'
          },
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'user_id',
        references: {
          model: {
            tableName: 'users',
            table: 'users',
            name: 'user',
            schema: 'public',
            delimiter: '.'
          },
          key: 'id'
        }
      },
      winAmount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        field: 'win_amount'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at'
      }
    }, { schema: 'public' })
  },

  down: async (queryInterface, _) => {
    await queryInterface.dropTable('chat_rain_users', { schema: 'public' })
  }
}
