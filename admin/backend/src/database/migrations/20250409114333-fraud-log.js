module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */

  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'fraud_log',
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'email',
          _modelAttribute: true,
          field: 'email'
        },
        ip: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'ip',
          _modelAttribute: true,
          field: 'ip'
        },
        seonId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          fieldName: 'seonId',
          _modelAttribute: true,
          field: 'seon_id'
        },
        fraudScore: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'fraudScore',
          _modelAttribute: true,
          field: 'fraud_score'
        },
        appliedRules: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'appliedRules',
          _modelAttribute: true,
          field: 'applied_rules'
        },
        moreDetails: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'moreDetails',
          _modelAttribute: true,
          field: 'more_details'
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: true,
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
    return queryInterface.dropTable('fraud_log', { schema: 'public' })
  }
}
