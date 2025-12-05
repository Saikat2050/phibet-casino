module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'casino_categories',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        uniqueId: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          fieldName: 'uniqueId',
          _modelAttribute: true,
          field: 'unique_id'
        },
        name: {
          type: DataTypes.JSONB,
          allowNull: false,
          fieldName: 'name',
          _modelAttribute: true,
          field: 'name'
        },
        iconUrl: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'iconUrl',
          _modelAttribute: true,
          field: 'icon_url'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
          fieldName: 'isActive',
          _modelAttribute: true,
          field: 'is_active'
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'orderId',
          _modelAttribute: true,
          field: 'order_id'
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
    return queryInterface.dropTable('casino_categories', { schema: 'public' })
  }
}
