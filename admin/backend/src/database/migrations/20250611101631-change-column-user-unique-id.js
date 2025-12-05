module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.changeColumn('users', 'unique_id', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      fieldName: 'uniqueId',
      _modelAttribute: true,
      field: 'unique_id'
    })
  },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, DataTypes) => {
    await queryInterface.changeColumn('users', 'unique_id', {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: DataTypes.UUIDV4,
      fieldName: 'uniqueId',
      _modelAttribute: true,
      field: 'unique_id'
    })
  }
}
