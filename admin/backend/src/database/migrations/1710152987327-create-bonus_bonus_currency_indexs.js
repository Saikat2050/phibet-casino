module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return await Promise.all([
      queryInterface.addIndex('public.bonus_currencies', {
        unique: true,
        fields: ['bonus_id', 'currency_id'],
        type: '',
        parser: null,
        name: 'bonus_currencies_bonus_id_currency_id'
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
        'public.bonus_currenciess',
        'bonus_currencies_bonus_id_currency_id'
      )
    ])
  }
}
