module.exports = {
  /**
     * @param {import('sequelize').QueryInterface} queryInterface
     * @param {import('sequelize').DataTypes} DataTypes
     */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'user_activity',
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
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'userId',
          _modelAttribute: true,
          field: 'user_id'
        },
        activityType: {
          type: DataTypes.STRING,
          defaultValue: true,
          fieldName: 'activityType',
          _modelAttribute: true,
          field: 'activity_type'
        },
        createdAt: {
          allowNull: true,
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
    return queryInterface.dropTable('tags', { schema: 'public' })
  }
}
