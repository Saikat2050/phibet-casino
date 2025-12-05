module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return await Promise.all([
      queryInterface.addIndex('public.tournament_currencies', {
        unique: true,
        fields: ['tournament_id', 'currency_id'],
        type: '',
        parser: null,
        name: 'tournament_currencies_tournament_id_currency_id'
      }),
      queryInterface.addIndex('public.casino_tournament_games', {
        unique: true,
        fields: ['tournament_id', 'casino_game_id'],
        type: '',
        parser: null,
        name: 'casino_tournament_games_tournament_id_casino_game_id'
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
        'public.tournament_currencies',
        'tournament_currencies_tournament_id_currency_id'
      ),
      queryInterface.removeIndex('public.casino_tournament_games',
        'casino_tournament_games_tournament_id_casino_game_id'
      )
    ])
  }
}
