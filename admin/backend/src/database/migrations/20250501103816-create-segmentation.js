module.exports = {
  /**
     * @param {import('sequelize').QueryInterface} queryInterface
     * @param {import('sequelize').DataTypes} DataTypes
     */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'segmentation',
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
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'name',
          _modelAttribute: true,
          field: 'name'
        },
        comments: {
          type: DataTypes.STRING,
          defaultValue: '',
          fieldName: 'comments',
          _modelAttribute: true,
          field: 'comments'
        },
        condition: {
          type: DataTypes.JSONB,
          defaultValue: [],
          fieldName: 'condition',
          _modelAttribute: true,
          field: 'condition'
        },
        moreDetails: {
          type: DataTypes.JSONB,
          defaultValue: {},
          fieldName: 'moreDetails',
          _modelAttribute: true,
          field: 'more_details'
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
    return queryInterface.dropTable('segmentation', { schema: 'public' })
  }
}
