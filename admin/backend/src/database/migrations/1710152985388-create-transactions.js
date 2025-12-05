import { TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'transactions',
      {
        id: {
          allowNull: false,
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
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
        paymentProviderId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'paymentProviderId',
          _modelAttribute: true,
          field: 'payment_provider_id',
          references: {
            model: {
              tableName: 'payment_providers',
              table: 'payment_providers',
              name: 'paymentProvider',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        packageId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'packageId',
          _modelAttribute: true,
          field: 'package_id',
          references: {
            model: {
              tableName: 'packages',
              table: 'packages',
              name: 'package',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        status: {
          type: DataTypes.ENUM(Object.values(TRANSACTION_STATUS)),
          allowNull: false,
          defaultValue: 'pending',
          fieldName: 'status',
          _modelAttribute: true,
          field: 'status'
        },
        actioneeId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'actioneeId',
          _modelAttribute: true,
          field: 'actionee_id',
          references: {
            model: {
              tableName: 'admin_users',
              table: 'admin_users',
              name: 'adminUser',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        paymentId: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'paymentId',
          _modelAttribute: true,
          field: 'payment_id'
        },
        moreDetails: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'moreDetails',
          _modelAttribute: true,
          field: 'more_details'
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
    return queryInterface.dropTable('transactions', { schema: 'public' })
  }
}
