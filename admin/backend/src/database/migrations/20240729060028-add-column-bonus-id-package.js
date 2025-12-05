module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return await queryInterface.addColumn('packages', 'bonus_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      fieldName: 'bonusId',
      _modelAttribute: true,
      field: 'bonus_id',
      references: {
        model: {
          tableName: 'bonus',
          table: 'bonus',
          name: 'bonus',
          schema: 'public',
          delimiter: '.'
        },
        key: 'id'
      }
    })
  },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    return await queryInterface.removeColumn('packages', 'bonus_id')
  }
}
