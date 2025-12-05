module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    // Make admins nullable
    await queryInterface.changeColumn(
      'chat_groups',
      'admins',
      {
        type: DataTypes.ARRAY(DataTypes.STRING(255)),
        allowNull: true, // make nullable
        defaultValue: [] // keep default empty array
      },
      { schema: 'public' }
    )

    // Add users column
    await queryInterface.addColumn(
      'chat_groups',
      'users',
      {
        type: DataTypes.JSONB,
        allowNull: true
      },
      { schema: 'public' }
    )

    // Add segments column
    await queryInterface.addColumn(
      'chat_groups',
      'segments',
      {
        type: DataTypes.JSONB,
        allowNull: true
      },
      { schema: 'public' }
    )
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, DataTypes) => {
    // Revert admins to NOT NULL
    await queryInterface.changeColumn(
      'chat_groups',
      'admins',
      {
        type: DataTypes.ARRAY(DataTypes.STRING(255)),
        allowNull: false,
        defaultValue: []
      },
      { schema: 'public' }
    )

    // Remove columns
    await queryInterface.removeColumn('chat_groups', 'users', { schema: 'public' })
    await queryInterface.removeColumn('chat_groups', 'segments', { schema: 'public' })
  }
}
