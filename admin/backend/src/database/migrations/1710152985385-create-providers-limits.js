module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'provider_limits',
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
        providerId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'providerId',
          _modelAttribute: true,
          field: 'provider_id',
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
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        minDeposit: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          fieldName: 'minDeposit',
          _modelAttribute: true,
          field: 'min_deposit'
        },
        maxDeposit: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          fieldName: 'maxDeposit',
          _modelAttribute: true,
          field: 'max_deposit'
        },
        minWithdraw: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          fieldName: 'minWithdraw',
          _modelAttribute: true,
          field: 'min_withdraw'
        },
        maxWithdraw: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          fieldName: 'maxWithdraw',
          _modelAttribute: true,
          field: 'max_withdraw'
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
    return queryInterface.dropTable('provider_limits', { schema: 'public' })
  }
}
