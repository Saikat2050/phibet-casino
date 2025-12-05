module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'currencies',
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
          allowNull: false,
          fieldName: 'name',
          _modelAttribute: true,
          field: 'name'
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          fieldName: 'code',
          _modelAttribute: true,
          field: 'code'
        },
        exchangeRate: {
          type: DataTypes.DECIMAL,
          allowNull: false,
          defaultValue: 1,
          fieldName: 'exchangeRate',
          _modelAttribute: true,
          field: 'exchange_rate'
        },
        type: {
          type: DataTypes.ENUM,
          allowNull: false,
          defaultValue: 'gold-coin',
          values: ['gold-coin', 'sweep-coin'],
          fieldName: 'type',
          _modelAttribute: true,
          field: 'type'
        },
        symbol: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'symbol',
          _modelAttribute: true,
          field: 'symbol'
        },
        isDefault: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          fieldName: 'isDefault',
          _modelAttribute: true,
          field: 'is_default'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
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
    return queryInterface.dropTable('currencies', { schema: 'public' })
  }
}
