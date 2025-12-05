'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('reported_users', {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      actioneeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'actionee_id',
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
      groupId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'group_id',
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      reportedUserId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'reported_user_id',
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
      isUnblocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_unblocked'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at'
      }
    }, { schema: 'public' })
  },

  down: async (queryInterface, _) => {
    await queryInterface.dropTable('reported_users', { schema: 'public' })
  }
}
