'use strict'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date()

    return queryInterface.bulkInsert(
      { tableName: 'chat_groups', schema: 'public' },
      [
        {
          name: 'GLOBAL',
          description: 'Global chat group for the application',
          status: true,
          is_global: true,
          created_at: now,
          updated_at: now
        }
      ]
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      { tableName: 'chat_groups', schema: 'public' },
      { name: 'GLOBAL' }
    )
  }
}
