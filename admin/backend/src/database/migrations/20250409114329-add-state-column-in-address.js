module.exports = {
  /**
     * Applies the migration.
     * @param {import('sequelize').QueryInterface} queryInterface
     * @param {import('sequelize').DataTypes} DataTypes
     */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('addresses', 'state_code', {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'stateCode'
    })
  },

  /**
     * Reverts the migration.
     * @param {import('sequelize').QueryInterface} queryInterface
     */
  down: async (queryInterface) => {
    await queryInterface.removeColumn('addresses', 'state_code')
  }
}
