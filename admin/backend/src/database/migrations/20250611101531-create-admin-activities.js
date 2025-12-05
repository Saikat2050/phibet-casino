module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'admin_activities',
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
        adminUserId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'adminUserId',
          _modelAttribute: true,
          field: 'admin_user_id',
          references: {
            model: {
              tableName: 'admin_users',
              table: 'admin_users',
              name: 'adminUser',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          }
        },
        entityId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'entityId',
          _modelAttribute: true,
          field: 'entity_id'
        },
        entityType: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'entityType',
          _modelAttribute: true,
          field: 'entity_type'
        },
        action: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'action',
          _modelAttribute: true,
          field: 'action'
        },
        changeTableId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'changeTableId',
          _modelAttribute: true,
          field: 'change_table_id'
        },
        changeTableName: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'changeTableName',
          _modelAttribute: true,
          field: 'change_table_name'
        },
        previousData: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'previousData',
          _modelAttribute: true,
          field: 'previous_data'
        },
        modifiedData: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'modifiedData',
          _modelAttribute: true,
          field: 'modified_data'
        },
        service: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'service',
          _modelAttribute: true,
          field: 'service'
        },
        category:{
          type: DataTypes.STRING,
          allowNull: false // Set to false if the field should be required
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
    return queryInterface.dropTable('admin_activities', { schema: 'public' })
  }
}
