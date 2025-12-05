module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.removeIndex(
      'public.casino_games',
      'casino_games_unique_id_casino_provider_id'
    )
    await queryInterface.removeIndex(
      'public.casino_games',
      'casino_games_unique_id_casino_provider_id_casino_category_id'
    )
    await queryInterface.addIndex('public.casino_games', {
      fields: ['unique_id', 'casino_provider_id'],
      type: '',
      parser: null,
      name: 'casino_games_unique_id_casino_provider_id'
    })
    await queryInterface.addIndex('public.casino_games', {
      fields: ['unique_id', 'casino_provider_id', 'casino_category_id'],
      type: '',
      parser: null,
      name: 'casino_games_unique_id_casino_provider_id_casino_category_id'
    })
    await queryInterface.addIndex('public.casino_games', {
      unique: true,
      fields: ['unique_id', 'name'],
      type: '',
      parser: null,
      name: 'casino_games_unique_id_name'
    })
    await queryInterface.changeColumn('users', 'phone_verified', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })
  },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeIndex(
      'public.casino_games',
      'casino_games_unique_id_casino_provider_id'
    )
    await queryInterface.removeIndex(
      'public.casino_games',
      'casino_games_unique_id_casino_provider_id_casino_category_id'
    )
    await queryInterface.addIndex('public.casino_games', {
      fields: ['unique_id', 'casino_provider_id'],
      type: '',
      parser: null,
      name: 'casino_games_unique_id_casino_provider_id'
    })
    await queryInterface.addIndex('public.casino_games', {
      fields: ['unique_id', 'casino_provider_id', 'casino_category_id'],
      type: '',
      parser: null,
      name: 'casino_games_unique_id_casino_provider_id_casino_category_id'
    })
    await queryInterface.changeColumn('users', 'phone_verified', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null
    })
  }
}
