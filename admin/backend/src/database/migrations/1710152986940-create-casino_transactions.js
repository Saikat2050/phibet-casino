module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'casino_transactions',
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
          type: DataTypes.INTEGER,
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
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
        },
        gameId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'gameId',
          _modelAttribute: true,
          field: 'game_id'
        },
        status: {
          type: DataTypes.ENUM,
          allowNull: false,
          defaultValue: 'pending',
          values: ['pending', 'completed', 'failed'],
          fieldName: 'status',
          _modelAttribute: true,
          field: 'status'
        },
        previousTransactionId: {
          type: DataTypes.STRING,
          defaultValue: DataTypes.UUIDV4,
          unique: true,
          fieldName: 'previousTransactionId',
          _modelAttribute: true,
          field: 'previous_transaction_id'
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
    return queryInterface.dropTable('casino_transactions', { schema: 'public' })
  }
}
