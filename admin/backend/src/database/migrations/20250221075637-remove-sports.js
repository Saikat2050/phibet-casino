'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    // await queryInterface.dropTable('bets', { schema: 'public' })
    // await queryInterface.dropTable('betslips', { schema: 'public' })
    // await queryInterface.dropTable('crypto_wallet_addresses', { schema: 'public' })
    // await queryInterface.dropTable('spreads', { schema: 'public' })
    // await queryInterface.dropTable('exchage_bets', { schema: 'public' })
    // await queryInterface.dropTable('event_market_outcomes', { schema: 'public' })
    // await queryInterface.dropTable('event_markets', { schema: 'public' })
    // await queryInterface.dropTable('event_participants', { schema: 'public' })
    // await queryInterface.dropTable('events', { schema: 'public' })
    // await queryInterface.dropTable('markets', { schema: 'public' })
    // await queryInterface.dropTable('participants', { schema: 'public' })
    // await queryInterface.dropTable('sportsbook_transactions', { schema: 'public' })
    // await queryInterface.dropTable('locations', { schema: 'public' })
    // await queryInterface.dropTable('leagues', { schema: 'public' })
    // await queryInterface.dropTable('sports', { schema: 'public' })
    // await queryInterface.dropTable     ('users_deposit_addresses', { schema: 'public' })

    const tables = [
      'bets',
      'betslips',
      'crypto_wallet_addresses',
      'spreads',
      'event_market_outcomes',
      'event_markets',
      'event_participants',
      'events',
      'markets',
      'participants',
      'sportsbook_transactions',
      'exchange_bets',
      'locations',
      'leagues',
      'sports',
      'users_deposit_addresses'
    ]

    for (const table of tables) {
      try {
        await queryInterface.sequelize.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`)
      } catch (err) {
        console.warn(`Failed to drop table ${table}: ${err.message}`)
      }
    }
  },

  async down (queryInterface, DataTypes) {
  }
}
