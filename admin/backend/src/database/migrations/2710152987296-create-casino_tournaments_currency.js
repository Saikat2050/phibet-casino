module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'tournament_currencies',
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
        tournamentId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'tournamentId',
          _modelAttribute: true,
          field: 'tournament_id',
          references: {
            model: {
              tableName: 'casino_tournaments',
              table: 'casino_tournaments',
              name: 'casino_tournament',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        currencyId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'currencyId',
          _modelAttribute: true,
          field: 'currency_id',
          references: {
            model: {
              tableName: 'currencies',
              table: 'currencies',
              name: 'currency',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
        },
        entryFees: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0.0,
          fieldName: 'entryFees',
          _modelAttribute: true,
          field: 'entry_fees'
        },
        rebuyFees: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          fieldName: 'rebuyFees',
          _modelAttribute: true,
          field: 'rebuy_fees'
        },
        rebuyLimit: {
          type: DataTypes.DOUBLE,
          defaultValue: 0,
          fieldName: 'rebuyLimit',
          _modelAttribute: true,
          field: 'rebuy_limit'
        },
        poolPrize: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          fieldName: 'poolPrize',
          _modelAttribute: true,
          field: 'pool_prize'
        },
        maxPlayerLimit: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'maxPlayerLimit',
          _modelAttribute: true,
          field: 'max_player_limit'
        },
        minPlayerLimit: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'minPlayerLimit',
          _modelAttribute: true,
          field: 'min_player_limit'
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
    return queryInterface.dropTable('tournament_currency', { schema: 'public' })
  }
}
