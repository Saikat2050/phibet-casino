module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'notifications',
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        title: {
          type: DataTypes.JSONB,
          allowNull: false,
          fieldName: 'title',
          _modelAttribute: true,
          field: 'title'
        },
        description: {
          type: DataTypes.JSONB,
          allowNull: false,
          fieldName: 'description',
          _modelAttribute: true,
          field: 'description'
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'image',
          _modelAttribute: true,
          field: 'image'
        },
        url: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'url',
          _modelAttribute: true,
          field: 'url'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          fieldName: 'isActive',
          defaultValue: true,
          field: 'is_active'
        },
        isPublicNotification: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          fieldName: 'isPublicNotification',
          defaultValue: true,
          field: 'is_public_notification'
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
    return queryInterface.dropTable('notifications', { schema: 'public' })
  }
}
