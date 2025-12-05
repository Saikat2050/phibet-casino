module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return await Promise.all([
      queryInterface.addColumn('casino_transactions', 'round_id', {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4
      }),
      queryInterface.addColumn('casino_transactions', 'meta_data', {
        type: DataTypes.JSONB,
        defaultValue: {}
      })
    ])
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    return await Promise.all([
      queryInterface.removeColumn(
        'casino_transactions',
        'round_id'
      ),
      queryInterface.removeColumn(
        'casino_transactions',
        'meta_data'
      )
    ])
  }
}
