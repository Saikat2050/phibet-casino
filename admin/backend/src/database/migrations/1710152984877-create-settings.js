module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'settings',
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
        key: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          fieldName: 'key',
          _modelAttribute: true,
          field: 'key'
        },
        value: {
          type: DataTypes.TEXT,
          allowNull: false,
          fieldName: 'value',
          _modelAttribute: true,
          field: 'value'
        },
        dataType: {
          type: DataTypes.ENUM,
          allowNull: false,
          values: ['string', 'number', 'boolean', 'percentage', 'json'],
          fieldName: 'dataType',
          _modelAttribute: true,
          field: 'data_type'
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: '',
          fieldName: 'description',
          _modelAttribute: true,
          field: 'description'
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
    return queryInterface.dropTable('settings', { schema: 'public' })
  }
}
