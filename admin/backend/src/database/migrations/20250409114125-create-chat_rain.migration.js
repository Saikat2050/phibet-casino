'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('chat_rains', {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      prizeMoney: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: 'prize_money'
      },
      currencyId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        default: 1,
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
        }
      },
      criteria: {
        type: DataTypes.JSONB,
        allowNull: true,
        default: {}
      },
      chatGroupId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'chat_group_id',
        references: {
          model: {
            tableName: 'chat_groups',
            table: 'chat_groups',
            name: 'chatGroup',
            schema: 'public',
            delimiter: '.'
          },
          key: 'id'
        }
      },
      isClosed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
        field: 'is_closed'
      },
      closedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'closed_at'
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
    await queryInterface.dropTable('chat_rains', { schema: 'public' })
  }
}
