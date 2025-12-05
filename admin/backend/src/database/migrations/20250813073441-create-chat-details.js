module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'chat_details',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        receiver: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'receiver',
          _modelAttribute: true,
          field: 'receiver',
          references: {
            model: {
              tableName: 'users',
              table: 'users',
              name: 'user',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        },
        groupId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'groupId',
          _modelAttribute: true,
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
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false,
          fieldName: 'message',
          _modelAttribute: true,
          field: 'message'
        },
        isGif: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          fieldName: 'isGif',
          _modelAttribute: true,
          field: 'is_gif',
          defaultValue: false
        },
        isOffensive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          fieldName: 'isOffensive',
          _modelAttribute: true,
          field: 'is_offensive',
          defaultValue: false
        },
        sender: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'sender',
          _modelAttribute: true,
          field: 'sender',
          references: {
            model: {
              tableName: 'users',
              table: 'users',
              name: 'user',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          fieldName: 'createdAt',
          _modelAttribute: true,
          field: 'created_at'
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          fieldName: 'updatedAt',
          _modelAttribute: true,
          field: 'updated_at'
        }
      },
      {
        schema: 'public'
      }
    )
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    return queryInterface.dropTable('chat_details', { schema: 'public' })
  }
}
