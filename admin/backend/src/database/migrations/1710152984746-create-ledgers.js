import { LEDGER_PURPOSE, LEDGER_TRANSACTION_TYPE } from '@src/utils/constants/public.constants.utils'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'ledgers',
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
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0,
          fieldName: 'amount',
          _modelAttribute: true,
          field: 'amount'
        },
        purpose: {
          type: DataTypes.ENUM(Object.values(LEDGER_PURPOSE)),
          allowNull: false,
          fieldName: 'purpose',
          _modelAttribute: true,
          field: 'purpose'
        },
        toWalletId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'toWalletId',
          _modelAttribute: true,
          field: 'to_wallet_id',
          references: {
            model: {
              tableName: 'wallets',
              table: 'wallets',
              name: 'wallet',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        fromWalletId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'fromWalletId',
          _modelAttribute: true,
          field: 'from_wallet_id',
          references: {
            model: {
              tableName: 'wallets',
              table: 'wallets',
              name: 'wallet',
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
        transactionType: {
          type: DataTypes.ENUM(Object.values(LEDGER_TRANSACTION_TYPE)),
          allowNull: false,
          fieldName: 'transactionType',
          _modelAttribute: true,
          field: 'transaction_type'
        },
        transactionId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'transactionId',
          _modelAttribute: true,
          field: 'transaction_id'
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
    return queryInterface.dropTable('ledgers', { schema: 'public' })
  }
}
