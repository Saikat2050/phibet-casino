module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('casino_categories', 'slug', {
      type: DataTypes.STRING,
      allowNull: true,
      fieldName: 'slug',
      _modelAttribute: true,
      field: 'slug'
    })
  },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    await queryInterface.removeColumn('casino_categories', 'slug')
  }
}
