module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'chat_settings',
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
        title: {
          type: DataTypes.STRING(225),
          allowNull: false,
          fieldName: 'title',
          _modelAttribute: true,
          field: 'title'
        },
        slug: {
          type: DataTypes.STRING(225),
          allowNull: false,
          fieldName: 'slug',
          _modelAttribute: true,
          field: 'slug'
        },
        type: {
          type: DataTypes.STRING(225),
          allowNull: false,
          fieldName: 'type',
          _modelAttribute: true,
          field: 'type'
        },
        options: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'options',
          _modelAttribute: true,
          field: 'options'
        },
        value: {
          type: DataTypes.STRING(225),
          allowNull: false,
          fieldName: 'value',
          _modelAttribute: true,
          field: 'value'
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
    return queryInterface.dropTable('chat_settings', { schema: 'public' })
  }
}
