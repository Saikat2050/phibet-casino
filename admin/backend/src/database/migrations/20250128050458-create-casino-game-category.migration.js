module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable(
      'casino_game_categories',
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
        casinoGameId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'casinoGameId',
          _modelAttribute: true,
          field: 'casino_game_id',
          references: {
            model: {
              tableName: 'casino_games',
              table: 'casino_games',
              name: 'casinoGame',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
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

    await queryInterface.addColumn('casino_games', 'more_details', {
      type: DataTypes.JSONB,
      allowNull: true,
      fieldName: 'moreDetails',
      _modelAttribute: true,
      field: 'more_details'
    })

    await queryInterface.addColumn('casino_providers', 'order_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      fieldName: 'orderId',
      _modelAttribute: true,
      field: 'order_id'
    })

    await queryInterface.addColumn('casino_games', 'restricted_states', {
      type: DataTypes.JSONB,
      allowNull: true,
      fieldName: 'restrictedStates',
      _modelAttribute: true,
      field: 'restricted_states'
    })

    await queryInterface.addColumn('casino_providers', 'restricted_states', {
      type: DataTypes.JSONB,
      allowNull: true,
      fieldName: 'restrictedStates',
      _modelAttribute: true,
      field: 'restricted_states'
    })

    await queryInterface.addColumn('casino_games', 'mobile_image_url', {
      type: DataTypes.STRING,
      allowNull: true,
      fieldName: 'mobileImageUrl',
      _modelAttribute: true,
      field: 'mobile_image_url'
    })

    await queryInterface.addColumn('casino_games', 'desktop_image_url', {
      type: DataTypes.STRING,
      allowNull: true,
      fieldName: 'desktopImageUrl',
      _modelAttribute: true,
      field: 'desktop_image_url'
    })

    await queryInterface.addColumn('states', 'is_active', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      fieldName: 'isActive',
      _modelAttribute: true,
      field: 'is_active'
    })

    await queryInterface.removeColumn('casino_games', 'restricted_countries')
    await queryInterface.removeColumn('casino_providers', 'restricted_countries')
    await queryInterface.removeColumn('casino_games', 'icon_url')
    await queryInterface.removeColumn('casino_games', 'has_freespins')
  },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    return queryInterface.dropTable('casino_game_categories', { schema: 'public' })
  }
}
