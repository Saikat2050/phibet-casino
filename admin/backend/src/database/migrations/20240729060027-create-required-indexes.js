'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.sequelize.query('CREATE INDEX idx_ledgers_created_at ON public.ledgers (created_at);'),
      queryInterface.sequelize.query('CREATE INDEX idx_ledgers_purpose ON public.ledgers (purpose);'),
      queryInterface.sequelize.query('CREATE INDEX idx_ledgers_from_wallet_id ON public.ledgers (from_wallet_id);'),
      queryInterface.sequelize.query('CREATE INDEX idx_ledgers_to_wallet_id ON public.ledgers (to_wallet_id);'),
      queryInterface.sequelize.query('CREATE INDEX idx_wallets_user_id ON wallets (user_id);')
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.sequelize.query('DROP INDEX IF EXISTS daily_statistical_summary_idx;'),
      queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_ledgers_created_at;'),
      queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_ledgers_purpose;'),
      queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_ledgers_from_wallet_id;'),
      queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_ledgers_to_wallet_id;'),
      queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_wallets_user_id;')
    ])
  }
}
