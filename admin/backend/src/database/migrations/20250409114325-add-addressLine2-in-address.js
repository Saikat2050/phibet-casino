module.exports = {
  /**
   * Applies the migration.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.renameColumn('addresses', 'address', 'address1')
    await queryInterface.addColumn('addresses', 'address2', {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'address2'
    })
  },

  /**
   * Reverts the migration.
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  down: async (queryInterface) => {
    await queryInterface.renameColumn('addresses', 'address1', 'address')
    await queryInterface.removeColumn('addresses', 'address2')
  }
}
