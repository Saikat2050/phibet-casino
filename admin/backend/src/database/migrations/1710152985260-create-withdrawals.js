import { WITHDRAWAL_STATUS } from '@src/utils/constants/public.constants.utils'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'withdrawals',
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
        status: {
          type: DataTypes.ENUM(Object.values(WITHDRAWAL_STATUS)),
          allowNull: false,
          defaultValue: 'pending',
          fieldName: 'status',
          _modelAttribute: true,
          field: 'status'
        },
        type: {
          type: DataTypes.ENUM,
          allowNull: false,
          values: ['bank', 'crypto'],
          fieldName: 'type',
          _modelAttribute: true,
          field: 'type'
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          fieldName: 'amount',
          _modelAttribute: true,
          field: 'amount'
        },
        transactionId: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'transactionId',
          _modelAttribute: true,
          field: 'transaction_id'
        },
        approvedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          fieldName: 'approvedAt',
          _modelAttribute: true,
          field: 'approved_at'
        },
        confirmedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          fieldName: 'confirmedAt',
          _modelAttribute: true,
          field: 'confirmed_at'
        },
        comment: {
          type: DataTypes.STRING,
          fieldName: 'comment',
          _modelAttribute: true,
          field: 'comment'
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
    return queryInterface.dropTable('withdrawals', { schema: 'public' })
  }
}
