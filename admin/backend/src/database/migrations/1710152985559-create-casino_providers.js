module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'casino_providers',
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
          type: DataTypes.JSONB,
          allowNull: false,
          fieldName: 'name',
          _modelAttribute: true,
          field: 'name'
        },
        uniqueId: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'uniqueId',
          _modelAttribute: true,
          field: 'unique_id'
        },
        casinoAggregatorId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'casinoAggregatorId',
          _modelAttribute: true,
          field: 'casino_aggregator_id',
          references: {
            model: {
              tableName: 'casino_aggregators',
              table: 'casino_aggregators',
              name: 'casinoAggregator',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          fieldName: 'isActive',
          _modelAttribute: true,
          field: 'is_active'
        },
        restrictedCountries: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: '[]',
          fieldName: 'restrictedCountries',
          _modelAttribute: true,
          field: 'restricted_countries'
        },
        iconUrl: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'iconUrl',
          _modelAttribute: true,
          field: 'icon_url'
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
    return queryInterface.dropTable('casino_providers', { schema: 'public' })
  }
}
