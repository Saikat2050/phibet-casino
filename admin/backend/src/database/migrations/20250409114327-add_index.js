module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return await Promise.all([
      queryInterface.addIndex('public.casino_transactions', {
        fields: ['user_id', 'created_at'],
        name: 'casino_transactions_user_id_created_at'
      }),
      queryInterface.addIndex('public.currencies', {
        fields: ['code', 'type'],
        name: 'currencies_code_type'
      }),
      queryInterface.addIndex('public.favorite_games', {
        fields: ['user_id', 'casino_game_id'],
        name: 'favorite_games_user_id_casino_game_id'
      }),
      queryInterface.addIndex('public.user_bonus', {
        fields: ['bonus_id'],
        name: 'user_bonus_id'
      }),
      queryInterface.addIndex('public.user_bonus', {
        fields: ['user_id'],
        name: 'user_user_id'
      }),
      queryInterface.addIndex('public.user_bonus', {
        fields: ['transaction_id'],
        name: 'user_transaction_id'
      }),
      queryInterface.addIndex('public.user_vip_tiers', {
        fields: ['user_id', 'vip_level_id'],
        name: 'user_vip_tiers_user_id_vip_level_id'
      }),
      queryInterface.addIndex('public.withdrawals', {
        fields: ['user_id', 'transaction_id'],
        name: 'withdrawals_user_id_transaction_id'
      }),
      queryInterface.addIndex('public.ledgers', {
        fields: ['transaction_type'],
        name: 'ledgers_transaction_type'
      }),
      queryInterface.addIndex('public.users', {
        fields: ['created_at'],
        name: 'users_created_at'
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
        'public.casino_transactions',
        'casino_transactions_user_id_created_at'
      ),
      queryInterface.removeIndex('public.currencies', 'currencies_code_type'),
      queryInterface.removeIndex(
        'public.favorite_games',
        'favorite_games_user_id_casino_game_id'
      ),
      queryInterface.removeIndex('public.user_bonus', 'user_bonus_id'),
      queryInterface.removeIndex('public.user_bonus', 'user_user_id'),
      queryInterface.removeIndex('public.user_bonus', 'user_transaction_id'),
      queryInterface.removeIndex(
        'public.user_vip_tiers',
        'user_vip_tiers_user_id_vip_level_id'
      ),
      queryInterface.removeIndex(
        'public.withdrawals',
        'withdrawals_user_id_transaction_id'
      ),
      queryInterface.removeIndex('public.ledgers', 'ledgers_transaction_type'),
      queryInterface.removeIndex('public.users', 'users_created_at')
    ])
  }
}
