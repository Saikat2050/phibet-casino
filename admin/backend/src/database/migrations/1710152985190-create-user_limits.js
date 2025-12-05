module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'user_limits',
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
        type: {
          type: DataTypes.ENUM,
          allowNull: false,
          values: [
            'enum',
            'string',
            'number',
            'boolean',
            'integer',
            'percentage'
          ],
          fieldName: 'type',
          _modelAttribute: true,
          field: 'type'
        },
        key: {
          type: DataTypes.ENUM,
          allowNull: false,
          values: [
            'self_exclusion',
            'daily_bet_limit',
            'weekly_bet_limit',
            'monthly_bet_limit',
            'daily_loss_limit',
            'weekly_loss_limit',
            'monthly_loss_limit',
            'daily_deposit_limit',
            'weekly_deposit_limit',
            'monthly_deposit_limit'
          ],
          fieldName: 'key',
          _modelAttribute: true,
          field: 'key'
        },
        value: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: '',
          fieldName: 'value',
          _modelAttribute: true,
          field: 'value'
        },
        currentValue: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: '',
          fieldName: 'currentValue',
          _modelAttribute: true,
          field: 'current_value'
        },
        expireAt: {
          allowNull: true,
          type: DataTypes.DATE,
          fieldName: 'expireAt',
          _modelAttribute: true,
          field: 'expire_at'
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
    return queryInterface.dropTable('user_limits', { schema: 'public' })
  }
}
