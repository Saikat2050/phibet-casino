module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return await queryInterface.addColumn('users', 'referred_by', {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: {
          tableName: 'users',
          table: 'users',
          name: 'user',
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
    return await queryInterface.removeColumn('users', 'referred_by')
  }
}
