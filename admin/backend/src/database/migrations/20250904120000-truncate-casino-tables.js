module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    const tablesToTruncate = [
      'casino_providers',
      'casino_aggregators', 
      'casino_categories',
      'casino_game_categories',
      'casino_games'
    ]

    for (const tableName of tablesToTruncate) {
      // Check if table exists before truncating
      const tableExists = await queryInterface.sequelize.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${tableName}'
        );
      `)

      const exists = tableExists[0][0].exists

      if (exists) {
        console.log(`Truncating table: ${tableName}`)
        await queryInterface.sequelize.query(`TRUNCATE TABLE "${tableName}" CASCADE;`)
      } else {
        console.log(`Table ${tableName} does not exist, skipping...`)
      }
    }
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, DataTypes) => {
    // This operation cannot be undone as data is permanently deleted
    console.log('TRUNCATE operation cannot be undone. Data has been permanently deleted.')
  }
}