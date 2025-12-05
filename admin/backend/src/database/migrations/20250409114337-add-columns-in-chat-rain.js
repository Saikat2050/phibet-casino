'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    return await Promise.all([
      queryInterface.addColumn('chat_rains', 'players_count', {
        type: DataTypes.INTEGER,
        allowNull: false,
        fieldName: 'playersCount',
        _modelAttribute: true,
        field: 'players_count'
      }),

      queryInterface.addColumn('chat_rains', 'more_details', {
        type: DataTypes.JSONB,
        allowNull: true,
        fieldName: 'moreDetails',
        _modelAttribute: true,
        field: 'more_details'
      }),

      queryInterface.addColumn('messages', 'more_details', {
        type: DataTypes.JSONB,
        allowNull: true,
        fieldName: 'moreDetails',
        _modelAttribute: true,
        field: 'more_details'
      }),

      queryInterface.addColumn('messages', 'currency_id', {
        type: DataTypes.BIGINT,
        allowNull: true,
        fieldName: 'currencyId',
        _modelAttribute: true,
        field: 'currency_id',
        references: {
          model: {
            tableName: 'currencies',
            table: 'currencies',
            name: 'currency',
            schema: 'public',
            delimiter: '.'
          },
          key: 'id'
        },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
      }),

      queryInterface.removeColumn('messages', 'shared_event'),

      queryInterface.removeColumn('messages', 'tip_id'),

      queryInterface.addColumn('chat_rains', 'admin_id', {
        type: DataTypes.BIGINT,
        allowNull: false,
        fieldName: 'adminId',
        _modelAttribute: true,
        field: 'admin_id',
        references: {
          model: {
            tableName: 'admin_users',
            table: 'admin_users',
            name: 'adminUser',
            schema: 'public',
            delimiter: '.'
          },
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'CASCADE'
      }),

      queryInterface.addColumn('users', 'chat_settings', {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
          fontSize: 14,
          displayGIF: true,
          displayLevel: true,
          notificationSound: 'all'
        }
      })
    ])
  },

  async down (queryInterface, DataTypes) {
    return await Promise.all([
      queryInterface.removeColumn('chat_rains', 'players_count'),

      queryInterface.removeColumn('chat_rains', 'more_details'),

      queryInterface.removeColumn('messages', 'more_details'),

      queryInterface.removeColumn('messages', 'currency_id'),

      queryInterface.addColumn('messages', 'shared_event', {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        field: 'shared_event'
      }),

      queryInterface.addColumn('messages', 'tip_id', {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'tip_id'
      }),

      queryInterface.removeColumn('chat_rains', 'admin_id'),

      queryInterface.removeColumn('users', 'chat_settings')
    ])
  }
}
