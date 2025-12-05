module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return await Promise.all([
      queryInterface.addIndex('public.casino_providers', {
        unique: true,
        fields: ['unique_id', 'casino_aggregator_id'],
        type: '',
        parser: null,
        name: 'casino_providers_unique_id_casino_aggregator_id'
      })
    ])
  },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    return await Promise.all([
      queryInterface.removeIndex(
        'public.casino_providers',
        'casino_providers_unique_id_casino_aggregator_id'
      )
    ])
  }
}
