module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'pages',
      {
        id: {
          allowNull: false,
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
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          fieldName: 'slug',
          _modelAttribute: true,
          field: 'slug'
        },
        content: {
          type: DataTypes.JSONB,
          allowNull: false,
          fieldName: 'content',
          _modelAttribute: true,
          field: 'content'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          fieldName: 'isActive',
          _modelAttribute: true,
          field: 'is_active'
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
          fieldName: 'createdAt',
          _modelAttribute: true,
          field: 'created_at'
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
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
    return queryInterface.dropTable('pages', { schema: 'public' })
  }
}
