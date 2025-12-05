module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'user_tournaments',
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
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'userId',
          _modelAttribute: true,
          field: 'user_id',
          references: {
            model: {
              tableName: 'users',
              table: 'users',
              name: 'user',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
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
        points: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          fieldName: 'points',
          _modelAttribute: true,
          field: 'points'
        },
        winPoints: {
          type: DataTypes.DOUBLE,
          defaultValue: 0,
          fieldName: 'winPoints',
          _modelAttribute: true,
          field: 'win_points'
        },
        amountSpent: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          fieldName: 'amountSpent',
          _modelAttribute: true,
          field: 'amount_spent'
        },
        rebuyLimit: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'rebuyLimit',
          _modelAttribute: true,
          field: 'rebuy_limit'
        },
        winPrize: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          fieldName: 'winPrize',
          _modelAttribute: true,
          field: 'win_prize'
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
    return queryInterface.dropTable('user_tournaments', { schema: 'public' })
  }
}
