module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await Promise.all([
      queryInterface.addIndex('public.withdrawals', {
        fields: ['created_at', 'updated_at', 'status'],
        name: 'withdrawals_created_updated_status'
      })
    ])
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    await Promise.all([
      queryInterface.removeIndex(
        'public.withdrawals',
        'withdrawals_created_updated_status'
      )
    ])
  }
}
