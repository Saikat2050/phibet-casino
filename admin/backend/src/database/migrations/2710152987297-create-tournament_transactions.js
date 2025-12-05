import { TRANSACTION_PURPOSE, TRANSACTION_TYPE } from '@src/utils/constants/casinoTournament.constants'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'tournament_transactions',
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
        transactionId: {
          type: DataTypes.STRING,
          defaultValue: DataTypes.UUIDV4,
          unique: true,
          fieldName: 'transactionId',
          _modelAttribute: true,
          field: 'transaction_id'
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
        type: {
          type: DataTypes.ENUM(Object.values(TRANSACTION_TYPE)),
          allowNull: false,
          fieldName: 'type',
          _modelAttribute: true,
          field: 'type'
        },
        purpose: {
          type: DataTypes.ENUM(Object.values(TRANSACTION_PURPOSE)),
          allowNull: false,
          fieldName: 'purpose',
          _modelAttribute: true,
          field: 'purpose'
        },
        points: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          fieldName: 'points',
          _modelAttribute: true,
          field: 'points'
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
    return queryInterface.dropTable('tournament_transactions', { schema: 'public' })
  }
}
