module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return await Promise.all([
      queryInterface.addIndex('public.casino_games', {
        unique: true,
        fields: ['unique_id', 'casino_provider_id'],
        type: '',
        parser: null,
        name: 'casino_games_unique_id_casino_provider_id'
      }),
      queryInterface.addIndex('public.casino_games', {
        unique: true,
        fields: ['unique_id', 'casino_provider_id', 'casino_category_id'],
        type: '',
        parser: null,
        name: 'casino_games_unique_id_casino_provider_id_casino_category_id'
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
        'public.casino_games',
        'casino_games_unique_id_casino_provider_id'
      ),
      queryInterface.removeIndex(
        'public.casino_games',
        'casino_games_unique_id_casino_provider_id_casino_category_id'
      )
    ])
  }
}
