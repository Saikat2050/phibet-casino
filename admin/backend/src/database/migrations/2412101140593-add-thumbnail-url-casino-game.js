module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return await queryInterface.addColumn('casino_games', 'thumbnail_url', {
      type: DataTypes.JSONB,
      defaultValue: {}
    })
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    return await queryInterface.removeColumn(
      'casino_games',
      'thumbnail_url'
    )
  }
}
