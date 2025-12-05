import { TOURNAMENT_PRIZE_TYPE } from '@src/utils/constants/casinoTournament.constants'
module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'tournament_prizes',
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
        tournamentCurrencyId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'tournamentCurrencyId',
          _modelAttribute: true,
          field: 'tournament_currency_id',
          references: {
            model: {
              tableName: 'tournament_currencies',
              table: 'tournament_currencies',
              name: 'tournamentCurrency',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          fieldName: 'amount',
          _modelAttribute: true,
          field: 'amount'
        },
        type: {
          type: DataTypes.ENUM(Object.values(TOURNAMENT_PRIZE_TYPE)),
          defaultValue: TOURNAMENT_PRIZE_TYPE.NONCASH,
          fieldName: 'type',
          _modelAttribute: true,
          field: 'type'
        },
        rank: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'rank',
          _modelAttribute: true,
          field: 'rank'
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
    return queryInterface.dropTable('tournament_prizes', { schema: 'public' })
  }
}
