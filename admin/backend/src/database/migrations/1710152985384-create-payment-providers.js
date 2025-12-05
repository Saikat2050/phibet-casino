module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'payment_providers',
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
        name: {
          type: DataTypes.JSONB,
          allowNull: false,
          fieldName: 'name',
          _modelAttribute: true,
          field: 'name'
        },
        aggregator: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'aggregator',
          _modelAttribute: true,
          field: 'aggregator'
        },
        description: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'description',
          _modelAttribute: true,
          field: 'description'
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'image',
          _modelAttribute: true,
          field: 'image'
        },
        depositAllowed: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          fieldName: 'depositAllowed',
          _modelAttribute: true,
          field: 'deposit_allowed'
        },
        withdrawAllowed: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          fieldName: 'withdrawAllowed',
          _modelAttribute: true,
          field: 'withdraw_allowed'
        },
        category: {
          type: DataTypes.ENUM,
          allowNull: false,
          defaultValue: 'Instant Banking',
          values: ['Instant Banking', 'Credit Card', 'Wallet', 'Crypto', 'Vouchers', 'Other'],
          fieldName: 'category',
          _modelAttribute: true,
          field: 'category'
        },
        blockedCountries: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'blockedCountries',
          _modelAttribute: true,
          field: 'blocked_countries'
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
    return queryInterface.dropTable('payment_providers', { schema: 'public' })
  }
}
