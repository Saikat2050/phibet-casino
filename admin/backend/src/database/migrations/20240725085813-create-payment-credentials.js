module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'provider_credentials',
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
        name: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'name',
          _modelAttribute: true,
          field: 'name'
        },
        credentials: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'credentials',
          _modelAttribute: true,
          field: 'credentials'
        },
        providerType: {
          type: DataTypes.ENUM,
          allowNull: false,
          values: [
            'payment',
            'casino',
            'crm',
            'other'
          ],
          fieldName: 'providerType',
          _modelAttribute: true,
          field: 'provider_type'
        },
        icon: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'icon',
          _modelAttribute: true,
          field: 'icon'
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
    return queryInterface.dropTable('provider_credentials', { schema: 'public' })
  }
}
