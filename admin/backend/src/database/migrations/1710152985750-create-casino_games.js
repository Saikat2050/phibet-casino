module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'casino_games',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.BIGINT,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        uniqueId: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'uniqueId',
          _modelAttribute: true,
          field: 'unique_id'
        },
        name: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'name',
          _modelAttribute: true,
          field: 'name'
        },
        casinoCategoryId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'casinoCategoryId',
          _modelAttribute: true,
          field: 'casino_category_id',
          references: {
            model: {
              tableName: 'casino_categories',
              table: 'casino_categories',
              name: 'casinoCategory',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
        },
        casinoProviderId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'casinoProviderId',
          _modelAttribute: true,
          field: 'casino_provider_id',
          references: {
            model: {
              tableName: 'casino_providers',
              table: 'casino_providers',
              name: 'casinoProvider',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
        },
        returnToPlayer: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          fieldName: 'returnToPlayer',
          _modelAttribute: true,
          field: 'return_to_player'
        },
        wageringContribution: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          fieldName: 'wageringContribution',
          _modelAttribute: true,
          field: 'wagering_contribution'
        },
        iconUrl: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'iconUrl',
          _modelAttribute: true,
          field: 'icon_url'
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'orderId',
          _modelAttribute: true,
          field: 'order_id'
        },
        volatilityRating: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'volatilityRating',
          _modelAttribute: true,
          field: 'volatility_rating'
        },
        hasFreespins: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          fieldName: 'hasFreespins',
          _modelAttribute: true,
          field: 'has_freespins'
        },
        devices: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'devices',
          _modelAttribute: true,
          field: 'devices'
        },
        demoAvailable: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          fieldName: 'demoAvailable',
          _modelAttribute: true,
          field: 'demo_available'
        },
        restrictedCountries: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: '[]',
          fieldName: 'restrictedCountries',
          _modelAttribute: true,
          field: 'restricted_countries'
        },
        isFeatured: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          fieldName: 'isFeatured',
          _modelAttribute: true,
          field: 'is_featured'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
          fieldName: 'isActive',
          _modelAttribute: true,
          field: 'is_active'
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
    return queryInterface.dropTable('casino_games', { schema: 'public' })
  }
}
