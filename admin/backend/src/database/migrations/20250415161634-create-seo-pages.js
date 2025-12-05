module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'seo_pages',
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
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          fieldName: 'slug',
          _modelAttribute: true,
          field: 'slug'
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'title',
          _modelAttribute: true,
          field: 'title'
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'description',
          _modelAttribute: true,
          field: 'description'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          fieldName: 'isActive',
          _modelAttribute: true,
          field: 'is_active'
        },
        noIndex: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          fieldName: 'noIndex',
          _modelAttribute: true,
          field: 'no_index'
        },
        canonicalUrl: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'canonicalUrl',
          _modelAttribute: true,
          field: 'canonical_url'
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
    return queryInterface.dropTable('seo_pages', { schema: 'public' })
  }
}
