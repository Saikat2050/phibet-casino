module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'states',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.BIGINT,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'code',
          _modelAttribute: true,
          field: 'code'
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'name',
          _modelAttribute: true,
          field: 'name'
        },
        countryId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'countryId',
          _modelAttribute: true,
          field: 'country_id',
          references: {
            model: {
              tableName: 'countries',
              table: 'countries',
              name: 'country',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'NO ACTION',
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
    return queryInterface.dropTable('states', { schema: 'public' })
  }
}
